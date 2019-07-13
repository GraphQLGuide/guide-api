import { AuthenticationError } from 'apollo-server'
import { getAuthIdFromJWT } from './util/auth'
import { db } from './db'

export default async ({ req }) => {
  const context = {}

  const jwt = req.headers.authorization
  let authId

  if (jwt) {
    try {
      authId = await getAuthIdFromJWT(jwt)
    } catch (e) {
      let message
      if (e.message.includes('jwt expired')) {
        message = 'jwt expired'
      } else {
        message = 'malformed jwt in authorization header'
      }
      throw new AuthenticationError(message)
    }

    const user = await db.collection('users').findOne({ authId })
    if (user) {
      context.user = user
    } else {
      throw new AuthenticationError('no such user')
    }
  }

  return context
}
