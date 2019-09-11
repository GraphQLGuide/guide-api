import { MongoClient } from 'mongodb'

export let db

const URL = 'mongodb://localhost:27017/guide'

export const connectToDB = async () => {
  const client = new MongoClient(URL, { useNewUrlParser: true })
  await client.connect()
  db = client.db()
  return client
}
