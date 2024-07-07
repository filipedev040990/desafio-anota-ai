import { ProductData, ProductEntity } from '@/domain/entities/product/product.entity'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CreateProductUseCaseInterface } from '@/domain/interfaces/usecases/product/create-product-usecase.interface'
import { InvalidParamError } from '@/shared/errors'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'

export class CreateProductUseCase implements CreateProductUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (input: ProductData): Promise<{ id: string }> {
    await this.validate(input)
    const product = ProductEntity.build(input)
    await this.productRepository.save(product)
    return { id: product.id }
  }

  async validate (input: ProductData): Promise<void> {
    const ownerExists = await this.ownerRepository.getById(input?.ownerId)

    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }

    const categoryExists = await this.categoryRepository.getByIdAndOwnerId(input?.categoryId, input?.ownerId)

    if (!categoryExists) {
      throw new InvalidParamError('categoryId')
    }
  }
}
