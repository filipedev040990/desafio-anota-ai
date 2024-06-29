import { CreateOwnerUseCase } from '@/application/usecases/owner/create-owner.usecase'
import { OwnerRepository } from '@/infra/database/repositories/owner.repository'

export const makeCreateOwnerUsecaseFactory = (): CreateOwnerUseCase => {
  const repository = new OwnerRepository()
  return new CreateOwnerUseCase(repository)
}
