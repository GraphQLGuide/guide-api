import { ForbiddenError } from 'apollo-server'
import { isEmpty } from 'lodash'

import { InputError } from '../util/errors'
import { pubsub } from '../util/pubsub'

const MIN_REVIEW_LENGTH = 2
const VALID_STARS = [0, 1, 2, 3, 4, 5]

export default {
  Query: {
    reviews: (_, __, { dataSources: { db } }) => db.getReviews()
  },
  Review: {
    author: (review, _, { dataSources: { db } }) =>
      db.getUser({ id: review.author_id }),
    fullReview: async (review, _, { dataSources: { db } }) => {
      const author = await db.getUser({ id: review.author_id })
      return `${author.first_name} ${author.last_name} gave ${review.stars} stars, saying: "${review.text}"`
    },
    createdAt: review => review.created_at,
    updatedAt: review => review.updated_at
  },
  Mutation: {
    createReview: (_, { review }, { dataSources: { db }, user }) => {
      if (!user) {
        throw new ForbiddenError('must be logged in')
      }

      const errors = {}

      if (review.text.length < MIN_REVIEW_LENGTH) {
        errors.text = `must be at least ${MIN_REVIEW_LENGTH} characters`
      }

      if (review.stars && !VALID_STARS.includes(review.stars)) {
        errors.stars = `must be between 0 and 5`
      }

      if (!isEmpty(errors)) {
        throw new InputError({ review: errors })
      }

      const newReview = db.createReview(review)

      pubsub.publish('reviewCreated', {
        reviewCreated: newReview
      })

      return newReview
    }
  },
  Subscription: {
    reviewCreated: { subscribe: () => pubsub.asyncIterator('reviewCreated') }
  }
}
