import { MongoDataSource } from 'apollo-datasource-mongodb'
import { ObjectId } from 'mongodb'

export default class Reviews extends MongoDataSource {
  getPage({ after, limit, orderBy }) {
    const filter = {}
    if (after) {
      const afterId = ObjectId(after)
      filter._id =
        orderBy === 'createdAt_DESC' ? { $lt: afterId } : { $gt: afterId }
    }

    return this.collection
      .find(filter)
      .sort({ _id: orderBy === 'createdAt_DESC' ? -1 : 1 })
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
