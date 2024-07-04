import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { GetOwnerByDocumentUseCaseInterface } from '@/domain/interfaces/usecases/owner/get-owner-by-document-usecase.interface'
import { MissingParamError } from '@/shared/errors'
import { isValidString } from '@/shared/helpers/string.helper'

type OwnerWithoutPassword = Omit<OwnerRepositoryData, 'password'> | null

export class GetOwnerByDocumentUseCase implements GetOwnerByDocumentUseCaseInterface {
  constructor (private readonly repository: OwnerRepositoryInterface) {}
  async execute (document: string): Promise<OwnerWithoutPassword> {
    if (!isValidString(document)) {
      throw new MissingParamError('document')
    }

    const owner = await this.repository.getByDocument(document)

    if (!owner) {
      return null
    }

    return {
      id: owner.id,
      name: owner.name,
      document: owner.document,
      createdAt: owner.createdAt,
      updatedAt: owner.updatedAt
    }
  }
}
