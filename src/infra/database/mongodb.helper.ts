import { MongoClient, Db } from 'mongodb'

let db: Db | null = null
let client: MongoClient

export const mongoConnect = async (): Promise<Db> => {
  if (db) {
    return db
  }

  client = new MongoClient(process.env.MONGO_DB_URL ?? '')
  await client.connect()

  db = client.db(process.env.MONGO_DB_DATABASE ?? '')
  return db
}

export const mongoDisconnect = async (): Promise<void> => {
  if (client) {
    await client.close()
  }
}
