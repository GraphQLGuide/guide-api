import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Reviews extends MongoDataSource {
  all() {
    return this.collection.find().toArray()
  }
}
