import { ForbiddenError } from 'apollo-server'
import { isEmpty } from 'lodash'
import joinMonster from 'join-monster'

import { InputError } from '../util/errors'
import { pubsub } from '../util/pubsub'
import { knex } from '../data-sources/'

const MIN_REVIEW_LENGTH = 2
const VALID_STARS = [0, 1, 2, 3, 4, 5]

export default {
  Query: {
    reviews: (_, __, context, info) =>
      joinMonster(info, context, sql => knex.raw(sql), {
        dialect: 'sqlite3'
      })
  },
  Review: {
    fullReview: async (review, _, { dataSources: { db } }) => {
      const author = await db.getUser({ id: review.author_id })
      return `${author.first_name} ${author.last_name} gave ${review.stars} stars, saying: "${review.text}"`
    }
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
