const resolvers = {
  Query: {
    hello: () => '🌍🌏🌎'
  }
}

import Review from './Review'
import User from './User'

export default [resolvers, Review, User]
