import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { prismaClient } from '../prisma-client'
import { UpdateOwnerInput } from '@/domain/interfaces/usecases/owner/update-owner-usecase.interface'

export class OwnerRepository implements OwnerRepositoryInterface {
  async save (input: OwnerRepositoryData): Promise<OwnerRepositoryData> {
    return await prismaClient.owner.create({
      data: {
        id: input.id,
        name: input.name,
        document: input.document,
        password: input.password,
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

  async update (input: UpdateOwnerInput): Promise<void> {
    const { id, name, document, password } = input

    const data: UpdateOwnerInput = { id }

    if (name) {
      data.name = name
    }

    if (document) {
      data.document = document
    }

    if (password) {
      data.password = password
    }

    await prismaClient.owner.update({ where: { id }, data })
  }
}
