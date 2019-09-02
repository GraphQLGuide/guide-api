import { MongoClient } from 'mongodb'

export let db

const URL = 'mongodb://localhost:27017/guide'

export const connectToDB = () => {
  const client = new MongoClient(URL, { useNewUrlParser: true })
  client.connect(e => {
    if (e) {
      console.error(`Failed to connect to MongoDB at ${URL}`, e)
      return
    }

    db = client.db()
  })
}
