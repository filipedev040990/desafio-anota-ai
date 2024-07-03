import { CreateProductController } from '@/adapters/controllers/product/create-product.controller'
import { makeCreateProductUsecaseFactory } from '../usecases/create-product-usecase.factory'

export const makeCreateProductControllerFactory = (): CreateProductController => {
  return new CreateProductController(makeCreateProductUsecaseFactory())
}
