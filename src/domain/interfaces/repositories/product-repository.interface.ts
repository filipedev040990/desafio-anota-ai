export type ProductRepositoryData = {
  id: string
  categoryId: string
  ownerId: string
  title: string
  description: string
  price: number
  createdAt: Date
  updatedAt: Date | null
}

export interface ProductRepositoryInterface {
  save: (input: ProductRepositoryData) => Promise<ProductRepositoryData>
  getById: (id: string) => Promise<ProductRepositoryData | null>
}
