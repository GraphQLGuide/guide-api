import { ForbiddenError } from 'apollo-server'
import { isEmpty } from 'lodash'

import { InputError } from '../util/errors'
import { pubsub } from '../util/pubsub'

const MIN_REVIEW_LENGTH = 2
const VALID_STARS = [0, 1, 2, 3, 4, 5]
const MAX_PAGE_SIZE = 100

export default {
  Query: {
    reviews: (
      _,
      { skip = 0, limit = 10, orderBy = 'createdAt_DESC' },
      { dataSources }
    ) => {
      const errors = {}

      if (skip < 0) {
        errors.skip = `must be non-negative`
      }

      if (limit < 0) {
        errors.limit = `must be non-negative`
      }

      if (limit > MAX_PAGE_SIZE) {
        errors.limit = `cannot be greater than ${MAX_PAGE_SIZE}`
      }

      if (!isEmpty(errors)) {
        throw new InputError({ review: errors })
      }

      return dataSources.reviews.getPage({ skip, limit, orderBy })
    }
  },
  Review: {
    id: review => review._id,
    author: (review, _, { dataSources }) =>
      dataSources.users.findOneById(review.authorId),
    fullReview: async (review, _, { dataSources }) => {
      const author = await dataSources.users.findOneById(review.authorId)
      return `${author.firstName} ${author.lastName} gave ${
        review.stars
      } stars, saying: "${review.text}"`
    },
    createdAt: review => review._id.getTimestamp()
  },
  Mutation: {
    createReview: (_, { review }, { dataSources, user }) => {
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

      const newReview = dataSources.reviews.create(review)

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
