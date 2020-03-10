import { ApolloServer } from 'apollo-server'
import { buildFederatedSchema } from '@apollo/federation'
import { MongoDataSource } from 'apollo-datasource-mongodb'

import resolvers from './resolvers'
import typeDefs from './schema'
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
    users: new MongoDataSource(mongoClient.db().collection('users'))
  }),
  context
})

mongoClient.connect()

server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀 Users service ready at ${url}`)
})
