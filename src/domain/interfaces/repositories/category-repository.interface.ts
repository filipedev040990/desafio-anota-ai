export type CategoryRepositoryData = {
  id: string
  ownerId: string
  title: string
  description: string
  createdAt: Date
  updatedAt: Date | null
}

export interface CategoryRepositoryInterface {
  save: (input: CategoryRepositoryData) => Promise<CategoryRepositoryData>
  getById: (id: string) => Promise<CategoryRepositoryData | null>
  getByIdAndOwnerId: (categoryId: string, ownerId: string) => Promise<CategoryRepositoryData | null>
}
