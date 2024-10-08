import { ListProductOutput } from '../usecases/product/list-all-products-usecase.interface'

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
  getByIdAndOwnerId: (productId: string, ownerId: string) => Promise<ProductRepositoryData | null>
  getAll: (ownerId: string) => Promise<ListProductOutput [] | null>
  getByIdAndCategoryId: (id: string, categoryId: string) => Promise<ProductRepositoryData | null>
  getByCategoryId: (categoryId: string) => Promise<ProductRepositoryData [] | null>
  getByAllFields: (categoryId: string, ownerId: string, title: string, description: string, price: number) => Promise<ProductRepositoryData | null>
  delete: (id: string, ownerId: string) => Promise<void>
}
