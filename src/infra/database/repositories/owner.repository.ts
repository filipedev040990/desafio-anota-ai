import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { mongoConnect } from '../mongodb.helper'
import { ObjectId } from 'mongodb'

export class OwnerRepository implements OwnerRepositoryInterface {
  async save (input: OwnerRepositoryData): Promise<OwnerRepositoryData> {
    const client = await mongoConnect()
    const collection = client.collection('owner')
    await collection.insertOne({
      _id: input.id as unknown as ObjectId,
      name: input.name,
      document: input.document,
      createdAt: input.createdAt,
      updatedAt: input.updatedAt
    })

    return input
  }
}
