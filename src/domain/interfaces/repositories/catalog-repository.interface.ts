export type CatalogRepositoryData = {
  id: string
  ownerId: string
  categoryId: string
  createdAt: Date
  updatedAt: Date | null
}

export type CatalogItemRepositoryData = {
  id: string
  productId: string
  catalogId: string
  createdAt: Date
  updatedAt: Date | null
}

export interface CatalogRepositoryInterface {
  save: (input: CatalogRepositoryData) => Promise<CatalogRepositoryData>
  saveItems: (input: CatalogItemRepositoryData) => Promise<void>
}
