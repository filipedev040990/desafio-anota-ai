import { ProductEntity } from '@/domain/entities/product/product.entity'
import { ProductRepositoryData, ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CreateProductInput, CreateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/create-product-usecase.interface'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { logger } from '@/shared/helpers/logger.helper'

export class CreateProductUseCase implements CreateProductUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (input: CreateProductInput): Promise<void> {
    await this.validateOwner(input)
    await this.validateProductCategory(input)
    await this.handleProducts(input)
  }

  async validateOwner (input: CreateProductInput): Promise<void> {
    const ownerExists = await this.ownerRepository.getById(input?.ownerId)
    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }
  }

  async validateProductCategory (input: CreateProductInput): Promise<void> {
    for (const product of input.products) {
      const categoryExists = await this.categoryRepository.getByIdAndOwnerId(product.categoryId, input.ownerId)
      if (!categoryExists) {
        throw new InvalidParamError('categoryId')
      }
    }
  }

  async handleProducts (input: CreateProductInput): Promise<void> {
    const validProducts: ProductRepositoryData[] = []

    for (const p of input.products) {
      for (const i of p.items) {
        try {
          const product = ProductEntity.build({
            ownerId: input.ownerId,
            categoryId: p.categoryId,
            title: i.title,
            description: i.description,
            price: i.price
          })

          const productAlreadyExists = await this.checkProductAlreadyExists(product)

          if (productAlreadyExists) {
            continue
          }

          validProducts.push(product)
        } catch (error) {
          logger.error(error)
          throw error
        }
      }
    }

    if (validProducts.length) {
      validProducts.map(async (product) => await this.productRepository.save(product))
    }
  }

  async checkProductAlreadyExists (newProduct: ProductEntity): Promise<boolean> {
    const { categoryId, ownerId, title, description, price } = newProduct
    const existingProduct = await this.productRepository.getByAllFields(categoryId, ownerId, title, description, price)
    return !!existingProduct
  }
}
