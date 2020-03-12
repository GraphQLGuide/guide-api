import { ObjectId } from 'mongodb'

import Date from '../../lib/Date'

export default {
  ...Date,
  Query: {
    reviews: (_, __, { dataSources }) => dataSources.reviews.all()
  },
  Review: {
    __resolveReference: (reference, { dataSources }) =>
      dataSources.reviews.findOneById(ObjectId(reference.id)),
    id: review => review._id,
    author: review => ({ id: review.authorId }),
    createdAt: review => review._id.getTimestamp()
  },
  User: {
    reviews: (user, _, { dataSources }) =>
      dataSources.reviews.all({ authorId: ObjectId(user.id) })
  }
}
