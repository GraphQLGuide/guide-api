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
import Github from './Github'
import PPP from './PPP'

const resolversByType = [Review, User, Date, Github, PPP]

resolversByType.forEach(type => merge(resolvers, type))

export default resolvers
