import { AuthenticationError, ForbiddenError } from 'apollo-server'
import { addDays, differenceInDays } from 'date-fns'
import joinMonster from 'join-monster'

import { knex } from '../data-sources/'

export default {
  Query: {
    me: (_, __, context) => context.user,
    user: (_, __, context, info) =>
      joinMonster(info, context, sql => knex.raw(sql), {
        dialect: 'sqlite3'
      }),
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
    }
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
