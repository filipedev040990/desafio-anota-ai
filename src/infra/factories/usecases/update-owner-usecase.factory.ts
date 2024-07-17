import { UpdateOwnerUseCase } from '@/application/usecases/owner/update-owner.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { BcryptAdapter } from '@/infra/tools/bcrypt'

export const makeUpdateOwnerUsecaseFactory = (): UpdateOwnerUseCase => {
  return new UpdateOwnerUseCase(new OwnerRepository(), new BcryptAdapter())
}
