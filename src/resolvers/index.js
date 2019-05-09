import { merge } from 'lodash'

const resolvers = {
  Query: {
    hello: () => '🌍🌏🌎'
  }
}

import Review from './Review'
import User from './User'

const resolversByType = [Review, User]

resolversByType.forEach(type => merge(resolvers, type))

export default resolvers
