import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Reviews extends MongoDataSource {
  all(query) {
    return this.collection.find(query).toArray()
  }
}
