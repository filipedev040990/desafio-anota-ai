import { CatalogRepositoryInterface } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { ProductRepositoryInterface } from '@/domain/interfaces/repositories/product-repository.interface'
import { DeleteCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/delete-category-usecase.interface'
import { InvalidParamError, MissingParamError } from '@/shared/errors'

export class DeleteCategoryUseCase implements DeleteCategoryUseCaseInterface {
  constructor (
    private readonly categoryRepository: CategoryRepositoryInterface,
    private readonly catalogRepository: CatalogRepositoryInterface,
    private readonly productRepository: ProductRepositoryInterface
  ) {}

  async execute (id: string, ownerId: string): Promise<void> {
    await this.validate(id, ownerId)
    await this.categoryRepository.delete(id, ownerId)
  }

  async validate (id: string, ownerId: string): Promise<void> {
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    const category = await this.categoryRepository.getByIdAndOwnerId(id, ownerId)
    if (!category) {
      throw new InvalidParamError('id')
    }

    const catalog = await this.catalogRepository.getByOwnerIdAndCategoryId(ownerId, id)
    if (catalog) {
      throw new InvalidParamError('This category is already in use by a catalog')
    }

    const product = await this.productRepository.getByCategoryId(id)
    if (product) {
      throw new InvalidParamError('This category is already in use by a product')
    }
  }
}
