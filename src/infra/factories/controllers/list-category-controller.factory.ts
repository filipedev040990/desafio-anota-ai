import { ListCategoryController } from '@/adapters/controllers/category/list-category.controller'
import { makeListCategoryUseCaseFactory } from '../usecases/list-category-usecase.factory'

export const makeListCategoryControllerFactory = (): ListCategoryController => {
  return new ListCategoryController(makeListCategoryUseCaseFactory())
}
