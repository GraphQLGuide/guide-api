import { AuthenticationError } from 'apollo-server'

export default {
  Query: {
    me: (_, __, context) => context.user
  },
  User: {
    id: ({ _id }) => _id,
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
