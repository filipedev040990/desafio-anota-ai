import { CatalogData } from '@/domain/entities/catalog/catalog.entity'

export interface CreateCatalogUseCaseInterface {
  execute: (input: CatalogData) => Promise<{ id: string }>
}
