import { AuthenticateController } from '@/adapters/controllers/authenticate/authenticate-category.controller'
import { makeAuthenticateUsecaseFactory } from '../usecases/authenticate-usecase.factory'

export const makeAuthenticateControllerFactory = (): AuthenticateController => {
  return new AuthenticateController(makeAuthenticateUsecaseFactory())
}
