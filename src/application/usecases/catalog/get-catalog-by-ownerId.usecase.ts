import { CatalogRepositoryInterface, FullCatalogRepositoryData } from '@/domain/interfaces/repositories/catalog-repository.interface'
import { GetCatalogByOwnerIdUseCaseInterface } from '@/domain/interfaces/usecases/catalog/get-catalog-by-ownerId.usecase.interface'

export class GetCatalogByOwnerIdUseCase implements GetCatalogByOwnerIdUseCaseInterface {
  constructor (private readonly repository: CatalogRepositoryInterface) {}
  async execute (ownerId: string): Promise<FullCatalogRepositoryData | null> {
    return await this.repository.getFullCatalog(ownerId)
  }
}
