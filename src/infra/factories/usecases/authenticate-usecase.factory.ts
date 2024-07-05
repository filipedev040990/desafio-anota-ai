import { AuthenticateUseCase } from '@/application/usecases/authenticate/authenticate.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { BcryptAdapter } from '@/infra/tools/bcrypt'
import { JwtAdapter } from '@/infra/tools/jwt'

export const makeAuthenticateUsecaseFactory = (): AuthenticateUseCase => {
  const secretKey = process.env.JWT_SECRET_KEY ?? ''
  const expiresIn = process.env.JWT_EXPIRES_IN ?? ''
  return new AuthenticateUseCase(new OwnerRepository(), new BcryptAdapter(), new JwtAdapter(secretKey, expiresIn))
}
