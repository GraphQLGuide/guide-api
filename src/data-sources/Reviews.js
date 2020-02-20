import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Reviews extends MongoDataSource {
  getPage({ skip, limit, orderBy }) {
    return this.collection
      .find()
      .sort({ _id: orderBy === 'createdAt_DESC' ? -1 : 1 })
      .skip(skip)
      .limit(limit)
      .toArray()
  }

  create(review) {
    review.authorId = this.context.user._id
    review.updatedAt = new Date()
    this.collection.insertOne(review)
    return review
  }
}
