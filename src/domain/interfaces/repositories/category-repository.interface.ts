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
}
