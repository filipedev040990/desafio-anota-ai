import { UpdateProductController } from '@/adapters/controllers/product/update-product.controller'
import { makeUpdateProductUsecaseFactory } from '../usecases/update-product-usecase.factory'

export const makeUpdateProductControllerFactory = (): UpdateProductController => {
  return new UpdateProductController(makeUpdateProductUsecaseFactory())
}
