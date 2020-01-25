import 'dotenv/config'
import { ApolloServer } from 'apollo-server'
import { makeExecutableSchema } from 'graphql-tools'

import typeDefs from './schema/schema.graphql'
import resolvers from './resolvers'
import dataSources, { Github } from './data-sources'
import context from './context'
import formatError from './formatError'
import joinMonsterAdapter from './joinMonsterAdapter'

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers
})

joinMonsterAdapter(schema)

const server = new ApolloServer({
  schema,
  dataSources,
  context,
  formatError
})

const start = () => {
  Github.startPolling()
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`GraphQL server running at ${url}`))
}

if (process.env.NODE_ENV !== 'test') {
  start()
}

export { server, typeDefs, resolvers, context, formatError }
