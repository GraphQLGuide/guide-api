import { merge } from 'lodash'

const resolvers = {
  Query: {
    hello: () => 'world 🌍🌏🌎',
    isoString: (_, { date }) => date.toISOString()
  }
}

import Review from './Review'
import User from './User'
import Date from './Date'
import Github from './Github'

const resolversByType = [Review, User, Date, Github]

resolversByType.forEach(type => merge(resolvers, type))

export default resolvers
