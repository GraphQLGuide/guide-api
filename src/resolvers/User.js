import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { ObjectId } from 'mongodb'

export default {
  Query: {
    me: (_, __, context) => context.user,
    user: (_, { id }, { dataSources }) =>
      dataSources.users.findOneById(ObjectId(id))
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
