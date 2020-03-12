import { gql } from 'apollo-server'

export default gql`
  scalar Date

  extend type Query {
    me: User
    user(id: ID!): User
  }

  type User @key(fields: "id") {
    id: ID!
    firstName: String!
    lastName: String!
    username: String!
    email: String
    photo: String!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Review @key(fields: "id") {
    id: ID! @external
    text: String! @external
    stars: Int @external
    authorId: ID! @external
    fullReview: String! @requires(fields: "authorId text stars")
  }
`
