import { CreateCatalogController } from '@/adapters/controllers/catalog/create-catalog.controller'
import { makeCreateCatalogUsecaseFactory } from '../usecases/create-catalog-usecase.factory'

export const makeCreateCatalogControllerFactory = (): CreateCatalogController => {
  return new CreateCatalogController(makeCreateCatalogUsecaseFactory())
}
