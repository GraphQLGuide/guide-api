import { ApolloServer } from 'apollo-server'
import { buildFederatedSchema } from '@apollo/federation'

import resolvers from './resolvers'
import typeDefs from './schema'
import Reviews from './Reviews'
import { mongoClient } from '../../lib/db'
import context from '../../lib/userContext'

const server = new ApolloServer({
  schema: buildFederatedSchema([
    {
      typeDefs,
      resolvers
    }
  ]),
  dataSources: () => ({
    reviews: new Reviews(mongoClient.db().collection('reviews'))
  }),
  context
})

mongoClient.connect()

server.listen({ port: 4002 }).then(({ url }) => {
  console.log(`🚀 Reviews service ready at ${url}`)
})
