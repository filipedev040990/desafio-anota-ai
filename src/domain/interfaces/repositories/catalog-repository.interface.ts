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

export type FullCatalogRepositoryData = {
  owner: string
  catalogs: FullCatalog []
}

export type FullCatalog = {
  categoryTitle: string
  categoryDescription: string
  items: FullCatalogItem []
}

export type FullCatalogItem = {
  title: string
  description: string
  price: number
}

export interface CatalogRepositoryInterface {
  save: (input: CatalogRepositoryData) => Promise<CatalogRepositoryData>
  saveItems: (input: CatalogItemRepositoryData) => Promise<void>
  deleteItems: (catalogId: string) => Promise<void>
  getByOwnerIdAndCategoryId: (ownerId: string, categoryId: string) => Promise <CatalogRepositoryData | null>
  getFullCatalog: (ownerId: string) => Promise<FullCatalogRepositoryData | null>
  getCatalogS3: (ownerId: string) => Promise<string>
  getCatalogItemByProductId: (productId: string) => Promise<CatalogItemRepositoryData [] | null>
}
