import jwt from 'jsonwebtoken'
import jwks from 'jwks-rsa'
import { promisify } from 'util'

const verify = promisify(jwt.verify)

const jwksClient = jwks({
  cache: true,
  rateLimit: true,
  jwksUri: 'https://graphql.auth0.com/.well-known/jwks.json'
})

const getPublicKey = (header, callback) => {
  jwksClient.getSigningKey(header.kid, (e, key) => {
    callback(e, key.publicKey || key.rsaPublicKey)
  })
}

export const getAuthIdFromJWT = async token => {
  if (!token) {
    return
  }

  const verifiedToken = await verify(token, getPublicKey, {
    algorithms: ['RS256'],
    audience: 'https://api.graphql.guide',
    issuer: 'https://graphql.auth0.com/'
  })

  return verifiedToken.sub
}
