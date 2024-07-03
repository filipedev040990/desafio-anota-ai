import { CreateOwnerUseCase } from '@/application/usecases/owner/create-owner.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'

export const makeCreateOwnerUsecaseFactory = (): CreateOwnerUseCase => {
  return new CreateOwnerUseCase(new OwnerRepository())
}
