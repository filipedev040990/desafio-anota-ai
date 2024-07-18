import { ListCategoryUseCase } from '@/application/usecases/category/list-category.usecase'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'

export const makeListCategoryUseCaseFactory = (): ListCategoryUseCase => {
  const repository = new CategoryRepository()
  return new ListCategoryUseCase(repository)
}
