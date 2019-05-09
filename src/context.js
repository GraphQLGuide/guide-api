import { getAuthIdFromJWT } from './util/auth'

export default async ({ req }) => {
  const context = {}

  const jwt = req.headers.authorization
  const authId = await getAuthIdFromJWT(jwt)
  if (authId === 'github|1615') {
    context.user = {
      firstName: 'John',
      lastName: 'Resig'
    }
  }

  return context
}
