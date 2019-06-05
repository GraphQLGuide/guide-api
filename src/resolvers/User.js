import { AuthenticationError } from 'apollo-server'

export default {
  Query: {
    me: (_, __, context) => context.user
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
