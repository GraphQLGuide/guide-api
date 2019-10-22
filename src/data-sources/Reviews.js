import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Reviews extends MongoDataSource {
  all() {
    return this.collection.find().toArray()
  }

  create(review) {
    review.updatedAt = new Date()
    this.collection.insertOne(review)
    return review
  }
}
