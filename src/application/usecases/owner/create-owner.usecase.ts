import { OwnerData, OwnerEntity } from '@/domain/entities/owner/owner.entitt'
import { OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { CreateOwnerUseCaseInterface } from '@/domain/interfaces/usecases/owner/create-owner-usecase.interface'

export class CreateOwnerUseCase implements CreateOwnerUseCaseInterface {
  constructor (private readonly repository: OwnerRepositoryInterface) {}
  async execute (input: OwnerData): Promise<{ id: string }> {
    const owner = OwnerEntity.build(input)
    await this.repository.save(owner)
    return { id: owner.id }
  }
}
