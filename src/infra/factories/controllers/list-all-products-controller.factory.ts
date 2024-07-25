import { ListAllProductsController } from '@/adapters/controllers/product/list-all-products.controller'
import { makeListAllProductsUsecaseFactory } from '../usecases/list-all-products-usecase.factory'

export const makeListAllProductsControllerFactory = (): ListAllProductsController => {
  return new ListAllProductsController(makeListAllProductsUsecaseFactory())
}
