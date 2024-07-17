import { UpdateOwnerController } from '@/adapters/controllers/owner/update-owner.controller'
import { makeUpdateOwnerUsecaseFactory } from '../usecases/update-owner-usecase.factory'

export const makeUpdateOwnerControllerFactory = (): UpdateOwnerController => {
  return new UpdateOwnerController(makeUpdateOwnerUsecaseFactory())
}
