import { CreateOwnerUseCase } from '@/application/usecases/owner/create-owner.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'
import { BcryptAdapter } from '@/infra/tools/bcrypt'

export const makeCreateOwnerUsecaseFactory = (): CreateOwnerUseCase => {
  return new CreateOwnerUseCase(new OwnerRepository(), new BcryptAdapter())
}
