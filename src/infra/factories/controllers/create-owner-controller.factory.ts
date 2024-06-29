import { CreateOwnerController } from '@/adapters/controllers/owner/create-owner.controller'
import { makeCreateOwnerUsecaseFactory } from '../usecases/create-owner-usecase.factory'

export const makeCreateOwnerControllerFactory = (): CreateOwnerController => {
  const usecase = makeCreateOwnerUsecaseFactory()
  return new CreateOwnerController(usecase)
}
