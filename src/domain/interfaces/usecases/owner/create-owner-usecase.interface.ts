import { OwnerData } from '@/domain/entities/owner/owner.entitt'

export interface CreateOwnerUseCaseInterface {
  execute: (input: OwnerData) => Promise<{ id: string}>
}
