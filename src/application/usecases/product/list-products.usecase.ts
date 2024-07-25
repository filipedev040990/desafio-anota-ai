import { ProductRepositoryData, ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError } from '@/shared/errors'
import { ListAllProductsUseCaseInterface } from '@/domain/interfaces/usecases/product/list-all-products-usecase.interface'

export class ListAllProductsUseCase implements ListAllProductsUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (ownerId: string): Promise<ProductRepositoryData [] | null> {
    const ownerExists = await this.ownerRepository.getById(ownerId)

    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }

    return await this.productRepository.getAll(ownerId)
  }
}
