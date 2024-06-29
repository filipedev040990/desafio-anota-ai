import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { GetOwnerByDocumentUseCaseInterface } from '@/domain/interfaces/usecases/owner/get-owner-by-document-usecase.interface'
import { MissingParamError } from '@/shared/errors'
import { isValidString } from '@/shared/helpers/string.helper'

export class GetOwnerByDocumentUseCase implements GetOwnerByDocumentUseCaseInterface {
  constructor (private readonly repository: OwnerRepositoryInterface) {}
  async execute (document: string): Promise<OwnerRepositoryData | null> {
    if (!isValidString(document)) {
      throw new MissingParamError('document')
    }

    return await this.repository.getByDocument(document)
  }
}
