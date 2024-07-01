import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { prismaClient } from '../prisma-client'

export class OwnerRepository implements OwnerRepositoryInterface {
  async save (input: OwnerRepositoryData): Promise<OwnerRepositoryData> {
    return await prismaClient.owner.create({
      data: {
        id: input.id,
        name: input.name,
        document: input.document,
        createdAt: input.createdAt,
        updatedAt: null
      }
    })
  }

  async getByDocument (document: string): Promise<OwnerRepositoryData | null> {
    return await prismaClient.owner.findFirst({ where: { document } })
  }

  async getById (id: string): Promise<OwnerRepositoryData | null> {
    return await prismaClient.owner.findFirst({ where: { id } })
  }
}
