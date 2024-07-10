export type CatalogRepositoryData = {
  id: string
  ownerId: string
  categoryId: string
  createdAt: Date
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
  deleteItems: (catalogId: string) => Promise<void>
  getByOwnerIdAndCategoryId: (ownerId: string, categoryId: string) => Promise <CatalogRepositoryData | null>
}
