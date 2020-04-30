import { merge } from 'lodash'

const resolvers = {
  Query: {
    hello: () => '🌍🌏🌎',
    isoString: (_, { date }) => new Date(date).toISOString()
  }
}

import Review from './Review'
import User from './User'
import DateResolvers from './Date'
import Github from './Github'

const resolversByType = [Review, User, DateResolvers, Github]

resolversByType.forEach(type => merge(resolvers, type))

export default resolvers
