import { GetCatalogByOwnerIdController } from '@/adapters/controllers/catalog/get-full-catalog.controller'
import { makeGetCatalogByOwnerIdUseCaseFactory } from '../usecases/get-catalog-by-ownerId-usecase.factory'

export const makeGetCatalogByOwnerIdControllerFactory = (): GetCatalogByOwnerIdController => {
  return new GetCatalogByOwnerIdController(makeGetCatalogByOwnerIdUseCaseFactory())
}
