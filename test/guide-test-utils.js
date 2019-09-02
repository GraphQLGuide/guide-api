import { ApolloServer } from 'apollo-server'
import { ObjectId } from 'mongodb'

import { Reviews, Users } from '../src/data-sources/'
import {
  typeDefs,
  resolvers,
  context as defaultContext,
  formatError
} from '../src/'

const updatedAt = new Date('2020-01-01')

export const mockUser = {
  _id: ObjectId('5d24f846d2f8635086e55ed3'),
  firstName: 'First',
  lastName: 'Last',
  username: 'mockA',
  authId: 'mockA|1',
  email: 'mockA@gmail.com',
  updatedAt
}

const mockUsers = [mockUser]

const reviewA = {
  _id: ObjectId('5ce6e47b5f97fe69e0d63479'),
  text: 'A+',
  stars: 5,
  updatedAt,
  authorId: mockUser._id
}

const reviewB = {
  _id: ObjectId('5cf8add4c872001f31880a97'),
  text: 'Passable',
  stars: 3,
  updatedAt,
  authorId: mockUser._id
}

const mockReviews = [reviewA, reviewB]

export const createTestServer = ({ context = defaultContext } = {}) => {
  const reviews = new Reviews({
    find: jest.fn(() => ({
      toArray: jest.fn().mockResolvedValue(mockReviews)
    })),
    insertOne: jest.fn(
      doc => (doc._id = new ObjectId('5cf8b6ff37568a1fa500ba4e'))
    )
  })

  const users = new Users({
    createIndex: jest.fn(),
    find: jest.fn(() => ({
      toArray: jest.fn().mockResolvedValue(mockUsers)
    }))
  })

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({ reviews, users }),
    context,
    formatError
  })

  return { server, dataSources: { reviews, users } }
}

export { createTestClient } from 'apollo-server-testing'
export { default as gql } from 'graphql-tag'
