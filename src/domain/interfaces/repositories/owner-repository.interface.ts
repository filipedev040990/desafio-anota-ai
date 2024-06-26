export type OwnerRepositoryData = {
  id: string
  name: string
  document: string
  createdAt: Date
  updatedAt: Date | null
}

export interface OwnerRepositoryInterface {
  save: (input: OwnerRepositoryData) => Promise<OwnerRepositoryData>
}
