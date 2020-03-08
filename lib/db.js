import { MongoClient } from 'mongodb'

const URL = 'mongodb://localhost:27017/guide'

export const mongoClient = new MongoClient(URL)
