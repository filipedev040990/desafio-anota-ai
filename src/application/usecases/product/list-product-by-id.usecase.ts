import { ProductRepositoryData, ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { ListProductByIdUseCaseInterface } from '@/domain/interfaces/usecases/product/list-product-by-id-usecase.interface'

export class ListProductByIdUseCase implements ListProductByIdUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (ownerId: string, productId: string): Promise<ProductRepositoryData | null> {
    await this.validate(ownerId, productId)
    return this.productRepository.getByIdAndOwnerId(productId, ownerId)
  }

  async validate (ownerId: string, productId: string): Promise<void> {
    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    if (!productId) {
      throw new MissingParamError('productId')
    }

    const ownerExists = await this.ownerRepository.getById(ownerId)

    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }
  }
}
