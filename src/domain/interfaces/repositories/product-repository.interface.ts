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

export type UpdateProductRepositoryData = {
  id: string
  categoryId?: string
  ownerId?: string
  title?: string
  description?: string
  price?: number
  updatedAt: Date
}

export interface ProductRepositoryInterface {
  save: (input: ProductRepositoryData) => Promise<ProductRepositoryData>
  update: (input: UpdateProductRepositoryData) => Promise<void>
  getById: (id: string) => Promise<ProductRepositoryData | null>
  getByIdAndCategoryId: (id: string, categoryId: string) => Promise<ProductRepositoryData | null>
  getByCategoryId: (categoryId: string) => Promise<ProductRepositoryData [] | null>
  getByAllFields: (categoryId: string, ownerId: string, title: string, description: string, price: number) => Promise<ProductRepositoryData | null>
}
