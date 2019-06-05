import { getAuthIdFromJWT } from './util/auth'
import { db } from './db'

export default async ({ req }) => {
  const context = {}

  const jwt = req.headers.authorization
  const authId = await getAuthIdFromJWT(jwt)
  const user = await db.collection('users').findOne({ authId })
  if (user) {
    context.user = user
  }

  return context
}
