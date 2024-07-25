import { ListProductByIdController } from '@/adapters/controllers/product/list-product-by-id.controller'
import { makeListProductByIdUsecaseFactory } from '../usecases/list-product-by-id-usecase.factory'

export const makeListProductByIdControllerFactory = (): ListProductByIdController => {
  return new ListProductByIdController(makeListProductByIdUsecaseFactory())
}
