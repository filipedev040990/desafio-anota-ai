import { CategoryRepositoryData, CategoryRepositoryInterface } from '@/domain/interfaces/repositories/category-repository.interface'
import { ListCategoryUseCaseInterface } from '@/domain/interfaces/usecases/category/list-category-usecase.interface'
import { MissingParamError } from '@/shared/errors'

export class ListCategoryUseCase implements ListCategoryUseCaseInterface {
  constructor (private readonly repository: CategoryRepositoryInterface) {}
  async execute (ownerId: string): Promise<CategoryRepositoryData [] | null> {
    if (!ownerId) {
      throw new MissingParamError('ownerId')
    }

    return await this.repository.getByOwnerId(ownerId)
  }
}
