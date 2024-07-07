import { AuthenticationMiddlewareInterface } from '@/domain/interfaces/middlewares/auth-middleware.interface'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { JwtInterface } from '@/domain/interfaces/tools/jwt.adapter.interface'
import { ForbiddenError, InvalidJwtError, JwtMissingError } from '@/shared/errors'
import { handleError } from '@/shared/helpers/error.helper'
import { success } from '@/shared/helpers/http.helper'
import { HttpRequest, HttpResponse } from '@/shared/types'

export class AuthenticationMiddleware implements AuthenticationMiddlewareInterface {
  constructor (
    private readonly jwtService: JwtInterface,
    private readonly ownerRepository: OwnerRepositoryInterface
  ) {}

  async execute (input: HttpRequest): Promise<HttpResponse> {
    try {
      if (!input?.headers?.authorization) {
        throw new JwtMissingError()
      }

      const token = input.headers.authorization.split('Bearer ')[1]

      const response: { id: string } = await this.jwtService.verify(token)

      if (!response) {
        throw new InvalidJwtError()
      }

      const owner = await this.ownerRepository.getById(response.id)

      if (!owner) {
        throw new ForbiddenError()
      }

      return success(200, owner.id)
    } catch (error) {
      return handleError(error)
    }
  }
}
