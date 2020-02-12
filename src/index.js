import 'dotenv/config'
import { ApolloServer, MockList } from 'apollo-server'
import casual from 'casual'

import typeDefs from './schema/schema.graphql'
import resolvers from './resolvers'
import dataSources, { Github } from './data-sources'
import context from './context'
import formatError from './formatError'
import { connectToDB } from './db'

const mocks = {
  Date: () => new Date(),
  Review: () => ({
    text: casual.sentence,
    stars: () => casual.integer(0, 5)
  }),
  User: () => ({
    firstName: casual.first_name,
    lastName: casual.last_name,
    username: casual.username,
    email: casual.email,
    photo: `https://placekitten.com/100/100`
  }),
  Query: () => ({
    reviews: () => new MockList([0, 3])
  })
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,
  formatError,
  mocks
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

export { server, typeDefs, resolvers, context, formatError }
