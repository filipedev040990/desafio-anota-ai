export type CategoryRepositoryData = {
  id: string
  ownerId: string
  title: string
  description: string
  createdAt: Date
  updatedAt?: Date
}

export interface CategoryRepositoryInterface {
  save: (input: CategoryRepositoryData) => Promise<CategoryRepositoryData>
}
