import {
  AuthenticationError,
  ForbiddenError,
  UserInputError
} from 'apollo-server'
import { ObjectId } from 'mongodb'
import { addDays, differenceInDays } from 'date-fns'

const OBJECT_ID_ERROR =
  'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'

export default {
  Query: {
    me: (_, __, context) => context.user,
    user: (_, { id }, { dataSources }) => {
      try {
        return dataSources.users.findOneById(ObjectId(id))
      } catch (error) {
        if (error.message === OBJECT_ID_ERROR) {
          throw new UserInputError('invalid id', {
            invalidArgs: ['id']
          })
        } else {
          throw error
        }
      }
    },
    searchUsers: (_, { term }, { dataSources }) =>
      dataSources.users.search(term)
  },
  UserResult: {
    __resolveType: result => {
      if (result.deletedAt) {
        return 'DeletedUser'
      } else if (result.suspendedAt) {
        return 'SuspendedUser'
      } else {
        return 'User'
      }
    }
  },
  SuspendedUser: {
    daysLeft: user => {
      const end = addDays(user.suspendedAt, user.durationInDays)
      return differenceInDays(end, new Date())
    }
  },
  User: {
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
  },
  Mutation: {
    createUser(_, { user, secretKey }, { dataSources }) {
      if (secretKey !== process.env.SECRET_KEY) {
        throw new AuthenticationError('wrong secretKey')
      }

      return dataSources.users.create(user)
    }
  }
}
