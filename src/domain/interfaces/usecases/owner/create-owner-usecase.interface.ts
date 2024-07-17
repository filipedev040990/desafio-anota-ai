import { OwnerData } from '@/domain/entities/owner/owner.entity'

export interface CreateOwnerUseCaseInterface {
  execute: (input: OwnerData) => Promise<{ id: string}>
}
