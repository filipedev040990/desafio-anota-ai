import { OwnerRepositoryData, OwnerRepositoryInterface } from '@/domain/interfaces/repositories/owner-repository.interface'
import { Collection, Db } from 'mongodb'

export class OwnerRepository /* implements OwnerRepositoryInterface */ {
  private readonly collection: Collection

  constructor (db: Db) {
    this.collection = db.collection('owners')
  }

  async save (input: OwnerRepositoryData): Promise<void> {
    console.log({ input })
    const results = await this.collection.insertOne(input)
    console.log({ results })
  }
}
