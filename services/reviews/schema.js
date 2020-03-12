import { gql } from 'apollo-server'

export default gql`
  scalar Date

  type Review @key(fields: "id") {
    id: ID!
    text: String!
    stars: Int
    authorId: ID!
    author: User!
    createdAt: Date!
    updatedAt: Date!
  }

  extend type Query {
    reviews: [Review!]!
  }

  extend type User @key(fields: "id") {
    id: ID! @external
    reviews: [Review!]!
  }
`
