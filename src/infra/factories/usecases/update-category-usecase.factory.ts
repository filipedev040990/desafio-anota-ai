import { UpdateCategoryUseCase } from '@/application/usecases/category/update-category.usecase'
import { CategoryRepository } from '@/infra/database/repositories/category.repository'

export const makeUpdateCategoryUsecaseFactory = (): UpdateCategoryUseCase => {
  return new UpdateCategoryUseCase(new CategoryRepository())
}
