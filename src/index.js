import { ApolloServer } from 'apollo-server'
import typeDefs from './schema/schema.graphql'
import resolvers from './resolvers'
import dataSources from './data-sources'
import context from './context'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`GraphQL server running at ${url}`))
