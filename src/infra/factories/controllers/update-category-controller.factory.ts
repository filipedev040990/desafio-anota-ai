import { UpdateCategoryController } from '@/adapters/controllers/category/update-category.controller'
import { makeUpdateCategoryUsecaseFactory } from '../usecases/update-category-usecase.factory'

export const makeUpdateCategoryControllerFactory = (): UpdateCategoryController => {
  return new UpdateCategoryController(makeUpdateCategoryUsecaseFactory())
}
