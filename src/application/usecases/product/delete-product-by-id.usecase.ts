import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'
import { DeleteProductUseCaseInterface } from '@/domain/interfaces/usecases/product/delete-product-usecase.interface'
import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'

export class DeleteProductUseCase implements DeleteProductUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface,
    private readonly catalogRepository: CatalogRepositoryInterface
  ) {}

  async execute (id: string, ownerId: string): Promise<void> {
    await this.validate(ownerId, id)
    await this.productRepository.delete(id, ownerId)
  }

  async validate (ownerId: string, productId: string): Promise<void> {
    await this.validateOwner(ownerId)
    await this.validateProduct(productId, ownerId)
  }

  async validateOwner (ownerId: string): Promise<void> {
    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    const ownerExists = await this.ownerRepository.getById(ownerId)

    if (!ownerExists) {
      throw new InvalidParamError('ownerId')
    }
  }

  async validateProduct (productId: string, ownerId: string): Promise<void> {
    if (!productId) {
      throw new MissingParamError('productId')
    }

    const productExists = await this.productRepository.getByIdAndOwnerId(productId, ownerId)

    if (!productExists) {
      throw new InvalidParamError('id')
    }

    const productIsAssociatedWithACatalog = await this.catalogRepository.getCatalogItemByProductId(productId)

    if (productIsAssociatedWithACatalog) {
      throw new InvalidParamError('This product is associated with a catalog')
    }
  }
}
