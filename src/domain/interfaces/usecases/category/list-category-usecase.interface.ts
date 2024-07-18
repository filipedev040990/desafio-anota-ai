import { CategoryRepositoryData } from '../../repositories/category-repository.interface'

export interface ListCategoryUseCaseInterface {
  execute: (ownerId: string) => Promise<CategoryRepositoryData [] | null>
}
