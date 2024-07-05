import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CryptographyInterface } from '@/domain/interfaces/tools/cryptography.interface'
import { JwtInterface } from '@/domain/interfaces/tools/jwt.adapter.interface'
import { AuthenticateUseCaseInterface } from '@/domain/interfaces/usecases/authenticate/authenticate-usecase.interface'
import { MissingParamError, UnauthorizedError } from '@/shared/errors'

export class AuthenticateUseCase implements AuthenticateUseCaseInterface {
  constructor (
    private readonly ownerRepository: OwnerRepositoryInterface,
    private readonly cryptographyService: CryptographyInterface,
    private readonly jwtService: JwtInterface
  ) {}

  async execute (document: string, password: string): Promise<{ accessToken: string }> {
    this.validate(document, password)

    const owner = await this.ownerRepository.getByDocument(document)

    if (owner) {
      const isValidPassword = await this.cryptographyService.compare(password, owner.password)

      if (isValidPassword) {
        const accessToken = await this.jwtService.sign({ id: owner.id })
        return { accessToken }
      }
    }

    throw new UnauthorizedError()
  }

  validate (document: string, password: string): void {
    if (!document) {
      throw new MissingParamError('document')
    }

    if (!password) {
      throw new MissingParamError('password')
    }
  }
}
