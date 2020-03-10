import { ForbiddenError } from 'apollo-server'
import { ObjectId } from 'mongodb'

import { InputError } from '../../lib/errors'
import Date from '../../lib/Date'

const OBJECT_ID_ERROR =
  'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'

export default {
  ...Date,
  Query: {
    me: (_, __, context) => context.user,
    user: (_, { id }, { dataSources }) => {
      try {
        return dataSources.users.findOneById(ObjectId(id))
      } catch (error) {
        if (error.message === OBJECT_ID_ERROR) {
          throw new InputError({ id: 'not a valid Mongo ObjectId' })
        } else {
          throw error
        }
      }
    }
  },
  User: {
    __resolveReference: (reference, { dataSources }) =>
      dataSources.users.findOneById(ObjectId(reference.id)),
    id: ({ _id }) => _id,
    email(user, _, { user: currentUser }) {
      if (!currentUser || !user._id.equals(currentUser._id)) {
        throw new ForbiddenError(`cannot access others' emails`)
      }

      return user.email
    },
    photo(user) {
      // user.authId: 'github|1615'
      const githubId = user.authId.split('|')[1]
      return `https://avatars.githubusercontent.com/u/${githubId}`
    },
    createdAt: user => user._id.getTimestamp()
  }
}
