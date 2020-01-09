import { ApolloServer } from 'apollo-server'
import { promisify } from 'util'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'
import { execute, toPromise } from 'apollo-link'

import {
  server,
  typeDefs,
  resolvers,
  context as defaultContext,
  formatError
} from '../src/'

const created_at = new Date('2020-01-01').getTime()
const updated_at = created_at

export const mockUser = {
  id: 1,
  first_name: 'First',
  last_name: 'Last',
  username: 'mockA',
  auth_id: 'mockA|1',
  email: 'mockA@gmail.com',
  created_at,
  updated_at
}

const mockUsers = [mockUser]

const reviewA = {
  id: 1,
  text: 'A+',
  stars: 5,
  created_at,
  updated_at,
  author_id: mockUser.id
}

const reviewB = {
  id: 2,
  text: 'Passable',
  stars: 3,
  created_at,
  updated_at,
  author_id: mockUser._id
}

const mockReviews = [reviewA, reviewB]

class SQL {
  getReviews() {
    return mockReviews
  }
  createReview() {
    return reviewA
  }
  createUser() {
    return mockUser
  }
  getUser() {
    return mockUser
  }
  searchUsers() {
    return mockUsers
  }
}

export const db = new SQL()

export const createTestServer = ({ context = defaultContext } = {}) => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ db }),
    context,
    formatError,
    engine: false
  })

  return { server, dataSources: { db } }
}

export const startE2EServer = async () => {
  const e2eServer = await server.listen({ port: 0 })

  const stopServer = promisify(e2eServer.server.close.bind(e2eServer.server))

  const link = new HttpLink({
    uri: e2eServer.url,
    fetch
  })

  return {
    stop: stopServer,
    request: operation => toPromise(execute(link, operation))
  }
}

export { createTestClient } from 'apollo-server-testing'
export { default as gql } from 'graphql-tag'
