import { UpdateOwnerInput } from '../usecases/owner/update-owner-usecase.interface'

export type OwnerRepositoryData = {
  id: string
  name: string
  document: string
  password: string
  createdAt: Date
  updatedAt: Date | null
}

export interface OwnerRepositoryInterface {
  save: (input: OwnerRepositoryData) => Promise<OwnerRepositoryData>
  getByDocument: (document: string) => Promise<OwnerRepositoryData | null>
  getById: (document: string) => Promise<OwnerRepositoryData | null>
  update: (input: UpdateOwnerInput) => Promise<void>
}
