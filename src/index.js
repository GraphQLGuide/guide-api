import 'dotenv/config'
import { ApolloServer } from 'apollo-server'
import typeDefs from './schema/schema.graphql'
import resolvers from './resolvers'
import dataSources, { Github } from './data-sources'
import context from './context'
import formatError from './formatError'
import { connectToDB } from './db'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  formatError
})

const start = () => {
  connectToDB()
  Github.startPolling()
  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`GraphQL server running at ${url}`))
}

if (process.env.NODE_ENV !== 'test') {
  start()
}

export { typeDefs, resolvers, context, formatError }
