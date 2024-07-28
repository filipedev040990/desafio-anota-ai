import { DeleteProductController } from '@/adapters/controllers/product/delete-product.controller'
import { makeDeleteProductUsecaseFactory } from '../usecases/delete-product-usecase.factory'

export const makeDeleteProductControllerFactory = (): DeleteProductController => {
  return new DeleteProductController(makeDeleteProductUsecaseFactory())
}
