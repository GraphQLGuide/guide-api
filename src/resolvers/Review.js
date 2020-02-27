import { ForbiddenError } from 'apollo-server'
import { isEmpty } from 'lodash'

import { InputError } from '../util/errors'
import { pubsub } from '../util/pubsub'
import { encodeCursor } from '../util/pagination'

const MIN_REVIEW_LENGTH = 2
const VALID_STARS = [0, 1, 2, 3, 4, 5]
const MAX_PAGE_SIZE = 100

export default {
  Query: {
    reviews: async (
      _,
      { first = 10, after, orderBy = 'createdAt_DESC', stars },
      { dataSources }
    ) => {
      const errors = {}

      if (first !== undefined && first < 1) {
        errors.first = `must be non-negative`
      }

      if (first > MAX_PAGE_SIZE) {
        errors.first = `cannot be greater than ${MAX_PAGE_SIZE}`
      }

      if (stars !== undefined && ![0, 1, 2, 3, 4, 5].includes(stars)) {
        errors.stars = `must be an integer between 0 and 5, inclusive`
      }

      if (!isEmpty(errors)) {
        throw new InputError({ review: errors })
      }

      const {
        reviews,
        hasNextPage,
        getHasPreviousPage
      } = await dataSources.reviews.getPage({ first, after, orderBy, stars })

      const edges = reviews.map(review => ({
        cursor: encodeCursor(review),
        node: review
      }))

      return {
        edges,
        pageInfo: {
          startCursor: encodeCursor(reviews[0]),
          endCursor: encodeCursor(reviews[reviews.length - 1]),
          hasNextPage,
          getHasPreviousPage
        },
        totalCount: dataSources.reviews.getCount({ stars })
      }
    }
  },
  PageInfo: {
    hasPreviousPage: ({ getHasPreviousPage }) => getHasPreviousPage()
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
