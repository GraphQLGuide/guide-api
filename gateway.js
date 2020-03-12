import { ApolloServer } from 'apollo-server'
import { ApolloGateway, RemoteGraphQLDataSource } from '@apollo/gateway'

import context from './context'
import { mongoClient } from './lib/db'

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    request.http.headers.set('user', JSON.stringify(context && context.user))
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: 'users', url: 'http://localhost:4001/graphql' },
    { name: 'reviews', url: 'http://localhost:4002/graphql' }
  ],
  buildService({ url }) {
    return new AuthenticatedDataSource({ url })
  },
  __exposeQueryPlanExperimental: true
})

const server = new ApolloServer({
  gateway,
  context,
  subscriptions: false
})

mongoClient.connect()

server.listen().then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`)
})
