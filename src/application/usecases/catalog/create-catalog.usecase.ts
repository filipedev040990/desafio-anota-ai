import { CatalogItemEntity } from '@/domain/entities/catalog-item/catalog-item.entity'
import { CatalogData, CatalogEntity } from '@/domain/entities/catalog/catalog.entity'
import { QueueInterface } from '@/domain/interfaces/queue/queue.interface'
import { CatalogRepositoryData, CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { CategoryRepositoryData, CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { CreateCatalogUseCaseInterface } from '@/domain/interfaces/usecases/catalog/create-catalog-usecase.interface'
import constants from '@/shared/constants'
import { InvalidParamError, MissingParamError, ServerError } from '@/shared/errors'
import { logger } from '@/shared/helpers/logger.helper'
import { queueDeduplicationIdGenerate } from '@/shared/helpers/queue.helper'

export type Item = {
  id: string
  title: string
  description: string
  price: number
}

export class CreateCatalogUseCase implements CreateCatalogUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly catalogRepository: CatalogRepositoryInterface,
    private readonly queueService: QueueInterface
  ) {}

  async execute (input: CatalogData): Promise<{ id: string }> {
    const owner = await this.handleOwner(input?.ownerId)
    const category = await this.handleCategory(input?.categoryId, input?.ownerId)
    const products = await this.handleProducts(input?.items, input?.categoryId)
    const catalogId = await this.handleCatalog(owner.id, category.id, products.map(product => product.id))

    await this.sendMessage(owner.id)

    return { id: catalogId }
  }

  async handleOwner (ownerId: string): Promise<OwnerRepositoryData> {
    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    const owner = await this.ownerRepository.getById(ownerId)

    if (!owner) {
      throw new InvalidParamError('ownerId')
    }

    return owner
  }

  async handleCategory (categoryId: string, ownerId: string): Promise<CategoryRepositoryData> {
    if (!categoryId) {
      throw new MissingParamError('categoryId')
    }

    const category = await this.categoryRepository.getByIdAndOwnerId(categoryId, ownerId)

    if (!category) {
      throw new InvalidParamError('categoryId')
    }

    return category
  }

  async handleProducts (productsId: string[], categoryId: string): Promise<Item []> {
    if (!productsId?.length) {
      throw new MissingParamError('items')
    }

    const products: Item [] = []

    for (const productId of productsId) {
      const product = await this.productRepository.getByIdAndCategoryId(productId, categoryId)

      if (!product) {
        throw new InvalidParamError(`productId: ${productId}`)
      }

      products.push({ id: product.id, title: product.title, description: product.description, price: product.price })
    }

    if (!products.length) {
      throw new InvalidParamError('productId')
    }

    return products
  }

  async handleCatalog (ownerId: string, categoryId: string, productsId: string[]): Promise<string> {
    const catalogExists = await this.catalogRepository.getByOwnerIdAndCategoryId(ownerId, categoryId)

    if (catalogExists) {
      return await this.handleExistingCatalog(catalogExists, categoryId, productsId)
    } else {
      return await this.handleNewCatalog(ownerId, categoryId, productsId)
    }
  }

  async handleExistingCatalog (catalog: CatalogRepositoryData, categoryId: string, productsId: string []): Promise<string> {
    await this.catalogRepository.deleteItems(catalog.id)
    await this.saveCatalogItems(catalog.id, productsId)
    return catalog.id
  }

  async handleNewCatalog (ownerId: string, categoryId: string, productsId: string []): Promise<string> {
    const catalog = CatalogEntity.build({ ownerId, categoryId, items: productsId })
    await this.catalogRepository.save(catalog)
    await this.saveCatalogItems(catalog.id, productsId)
    return catalog.id
  }

  async saveCatalogItems (catalogId: string, productsId: string []): Promise<void> {
    productsId.map(async (item) => {
      const catalogItem = CatalogItemEntity.build({ catalogId, productId: item })
      await this.catalogRepository.saveItems(catalogItem)
    })
  }

  async sendMessage (ownerId: string): Promise<void> {
    const messageBody = JSON.stringify({ ownerId })
    const queueName = constants.QUEUE_EMIT_CATALOG
    const deduplicationId = queueDeduplicationIdGenerate()

    const success = await this.queueService.sendMessage(queueName, messageBody, constants.MESSAGE_GROUP_ID, deduplicationId)

    if (!success) {
      logger.error(`Error publishing message: ${JSON.stringify(messageBody)}`)
      throw new ServerError(new Error('Error publishing message'))
    }
  }
}
