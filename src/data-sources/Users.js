import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Users extends MongoDataSource {
  create(user) {
    user.updatedAt = new Date()
    this.collection.insertOne(user)
    return user
  }
}
