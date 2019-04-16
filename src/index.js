import { ApolloServer, gql } from 'apollo-server'

const server = new ApolloServer({
  typeDefs: gql`
    type Query {
      hello: String!
    }
  `,
  resolvers: {
    Query: {
      hello: () => '🌍🌏🌎'
    }
  }
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`GraphQL server running at ${url}`))
