import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CryptographyInterface } from '@/domain/interfaces/tools/cryptography.interface'
import { UpdateOwnerInput, UpdateOwnerUseCaseInterface } from '@/domain/interfaces/usecases/owner/update-owner-usecase.interface'
import { ConflictError, InvalidParamError, MissingParamError } from '@/shared/errors'

export class UpdateOwnerUseCase implements UpdateOwnerUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly cryptographyService: CryptographyInterface
  ) {}

  async execute (input: UpdateOwnerInput): Promise<void> {
    await this.validate(input)
    await this.ownerRepository.update(this.makeInput(input))
  }

  async validate (input: UpdateOwnerInput): Promise<void> {
    const { id, name, document, password } = input
    if (!id) {
      throw new MissingParamError('id')
    }

    if (!name && !document && !password) {
      throw new InvalidParamError('Enter a field to be changed')
    }

    if (document) {
      const owner = await this.ownerRepository.getByDocument(document)
      if (owner && owner.id !== id) {
        throw new ConflictError('document')
      }
    }
  }

  makeInput (input: UpdateOwnerInput): UpdateOwnerInput {
    const output: UpdateOwnerInput = { id: input.id }

    if (input?.document) {
      output.document = input.document
    }

    if (input?.name) {
      output.name = input.name
    }

    if (input.password) {
      output.password = this.cryptographyService.encrypt(input.password)
    }

    return output
  }
}
