import { DeleteCategoryController } from '@/adapters/controllers/category/delete-category.controller'
import { makeDeleteCategoryUseCaseFactory } from '../usecases/delete-category-usecase.factory'

export const makeDeleteCategoryControllerFactory = (): DeleteCategoryController => {
  return new DeleteCategoryController(makeDeleteCategoryUseCaseFactory())
}
