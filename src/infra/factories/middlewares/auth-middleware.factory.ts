import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { AuthenticationMiddleware } from '@/infra/middlewares/auth-middleware'
import { JwtAdapter } from '@/infra/tools/jwt'

export const makeAuthenticationMiddlewareFactory = (): AuthenticationMiddleware => {
  const secretKey = process.env.JWT_SECRET_KEY ?? ''
  const expiresIn = process.env.JWT_EXPIRES_IN ?? ''
  return new AuthenticationMiddleware(new JwtAdapter(secretKey, expiresIn), new OwnerRepository())
}
