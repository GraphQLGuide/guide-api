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

export default [resolvers, Review, User, DateResolvers, Github]
