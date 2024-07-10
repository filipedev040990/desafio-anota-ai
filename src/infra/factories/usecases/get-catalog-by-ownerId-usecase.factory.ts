import { GetCatalogByOwnerIdUseCase } from '@/application/usecases/catalog/get-catalog-by-ownerId.usecase'
import { CatalogRepository } from '@/infra/database/repositories/catalog.repository'

export const makeGetCatalogByOwnerIdUseCaseFactory = (): GetCatalogByOwnerIdUseCase => {
  const repository = new CatalogRepository()
  return new GetCatalogByOwnerIdUseCase(repository)
}
