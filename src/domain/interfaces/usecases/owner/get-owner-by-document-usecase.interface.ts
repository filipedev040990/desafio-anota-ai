import { OwnerRepositoryData } from '../../repositories/owner-repository.interface'

export interface GetOwnerByDocumentUseCaseInterface {
  execute: (document: string) => Promise<OwnerRepositoryData | null>
}
