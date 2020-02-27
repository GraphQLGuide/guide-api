import { MongoDataSource } from 'apollo-datasource-mongodb'

import { decodeCursor } from '../util/pagination'

export default class Reviews extends MongoDataSource {
  async getPage({ first, after, orderBy, stars }) {
    const isDescending = orderBy === 'createdAt_DESC'
    const filter = {}
    const prevFilter = {}

    if (after) {
      const afterId = decodeCursor(after)
      filter._id = isDescending ? { $lt: afterId } : { $gt: afterId }
      prevFilter._id = isDescending ? { $gte: afterId } : { $lte: afterId }
    }

    if (stars) {
      filter.stars = stars
    }

    const sort = { _id: isDescending ? -1 : 1 }

    const getHasPreviousPage = () =>
      !!after &&
      this.collection
        .find(prevFilter)
        .sort(sort)
        .hasNext()

    const reviews = await this.collection
      .find(filter)
      .sort(sort)
      .limit(first + 1)
      .toArray()

    const hasNextPage = reviews.length > first
    if (hasNextPage) {
      reviews.pop()
    }

    return { reviews, hasNextPage, getHasPreviousPage }
  }

  getCount(filter) {
    return this.collection.find(filter).count()
  }

  create(review) {
    review.authorId = this.context.user._id
    review.updatedAt = new Date()
    this.collection.insertOne(review)
    return review
  }
}
