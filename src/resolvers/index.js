import { merge } from 'lodash'

const resolvers = {
  Query: {
    hello: () => '🌍🌏🌎',
    isoString: (_, { date }) => date.toISOString()
  }
}

import Review from './Review'
import User from './User'
import Date from './Date'

const resolversByType = [Review, User, Date]

resolversByType.forEach(type => merge(resolvers, type))

export default resolvers
