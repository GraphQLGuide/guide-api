const resolvers = {
  Query: {
    hello: () => '🌍🌏🌎',
    isoString: (_, { date }) => date.toISOString()
  }
}

import Review from './Review'
import User from './User'
import Date from './Date'
import Github from './Github'
import PPP from './PPP'

export default [resolvers, Review, User, Date, Github, PPP]
