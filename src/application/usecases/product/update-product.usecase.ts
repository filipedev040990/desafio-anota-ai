import { ProductRepositoryData, ProductRepositoryInterface, UpdateProductRepositoryData } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { UpdateProductUseCaseInterface, UpdateProductInput } from '@/domain/interfaces/usecases/product/update-product-usecase.interface'
import { publishUpdateCatalogMessage } from '@/shared/helpers/utils.helper'

export class UpdateProductUseCase implements UpdateProductUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (input: UpdateProductInput): Promise<void> {
    await this.validateOwner(input)
    await this.validateCategory(input)
    await this.validateProduct(input)
    await this.productRepository.update(this.makeUpdateInput(input))
    await publishUpdateCatalogMessage(input.ownerId)
  }

  async validateOwner (input: UpdateProductInput): Promise<void> {
    const ownerExists = await this.ownerRepository.getById(input?.ownerId)
    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }
  }

  async validateCategory (input: UpdateProductInput): Promise<void> {
    if (!input.categoryId) {
      return
    }

    const categoryExists = await this.categoryRepository.getByIdAndOwnerId(input.categoryId, input.ownerId)
    if (!categoryExists) {
      throw new InvalidParamError('categoryId')
    }
  }

  async validateProduct (input: UpdateProductInput): Promise<void> {
    const { id, categoryId, title, description, price } = input

    if (!categoryId && !title && !description && !price) {
      throw new InvalidParamError('Provide a field to be updated')
    }

    const product = await this.productRepository.getById(id)

    if (!product) {
      throw new InvalidParamError('id')
    }

    if (this.checkProductAlreadyExists(input, product)) {
      throw new InvalidParamError('This product already exists')
    }
  }

  makeUpdateInput (input: UpdateProductInput): UpdateProductRepositoryData {
    const { id, ownerId, categoryId, title, description, price } = input

    const updateInput: UpdateProductRepositoryData = {
      id,
      ownerId,
      updatedAt: new Date()
    }

    if (categoryId) {
      updateInput.categoryId = categoryId
    }

    if (description) {
      updateInput.description = description
    }

    if (title) {
      updateInput.title = title
    }

    if (price) {
      updateInput.price = price
    }

    return updateInput
  }

  checkProductAlreadyExists (newProduct: UpdateProductInput, oldProduct: ProductRepositoryData): boolean {
    return newProduct.categoryId === oldProduct.categoryId &&
      newProduct.description === oldProduct.description &&
      newProduct.price === oldProduct.price &&
      newProduct.title === oldProduct.title
  }
}
