import { CreateCategoryController } from '@/adapters/controllers/category/create-category.controller'
import { makeCreateCategoryUsecaseFactory } from '../usecases/create-category-usecase.factory'

export const makeCreateCategoryControllerFactory = (): CreateCategoryController => {
  return new CreateCategoryController(makeCreateCategoryUsecaseFactory())
}
