import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { addDays, differenceInDays } from 'date-fns'

export default {
  Query: {
    me: (_, __, context) => context.user,
    user: (_, { id }, { dataSources: { db } }) => db.getUser({ id }),
    searchUsers: (_, { term }, { dataSources: { db } }) => db.searchUsers(term)
  },
  UserResult: {
    __resolveType: result => {
      if (result.deleted_at) {
        return 'DeletedUser'
      } else if (result.suspended_at) {
        return 'SuspendedUser'
      } else {
        return 'User'
      }
    }
  },
  SuspendedUser: {
    daysLeft: user => {
      const end = addDays(user.suspended_at, user.duration_in_days)
      return differenceInDays(end, new Date())
    }
  },
  User: {
    firstName: user => user.first_name,
    lastName: user => user.last_name,
    email(user, _, { user: currentUser }) {
      if (!currentUser || user.id !== currentUser.id) {
        throw new ForbiddenError(`cannot access others' emails`)
      }

      return user.email
    },
    photo(user) {
      // user.auth_id: 'github|1615'
      const githubId = user.auth_id.split('|')[1]
      return `https://avatars.githubusercontent.com/u/${githubId}`
    },
    createdAt: user => user.created_at,
    updatedAt: user => user.updated_at
  },
  Mutation: {
    createUser(_, { user, secretKey }, { dataSources: { db } }) {
      if (secretKey !== process.env.SECRET_KEY) {
        throw new AuthenticationError('wrong secretKey')
      }

      return db.createUser(user)
    }
  }
}
