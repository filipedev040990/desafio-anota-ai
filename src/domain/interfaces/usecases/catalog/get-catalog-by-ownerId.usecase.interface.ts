import { FullCatalogRepositoryData } from '../../repositories/catalog-repository.interface'

export interface GetCatalogByOwnerIdUseCaseInterface {
  execute: (ownerId: string) => Promise<FullCatalogRepositoryData | null>
}
