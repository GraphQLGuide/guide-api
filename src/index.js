import { ApolloServer, gql } from 'apollo-server'
import { getAuthIdFromJWT } from './util/auth'
import Reviews from './data-sources/Reviews'
import { db } from './db'

const server = new ApolloServer({
  typeDefs: gql`
    type Query {
      me: User
      hello: String!
      reviews: [Review!]!
    }
    type User {
      firstName: String
      lastName: String
    }
    type Review {
      text: String!
      stars: Int
      fullReview: String!
    }
    type Mutation {
      createReview(review: CreateReviewInput!): Review
    }
    input CreateReviewInput {
      text: String!
      stars: Int
    }
  `,
  resolvers: {
    Query: {
      me: (_, __, context) => context.user,
      hello: () => '🌍🌏🌎',
      reviews: (_, __, { dataSources }) => dataSources.reviews.all()
    },
    Review: {
      fullReview: review =>
        `Someone on the internet gave ${review.stars} stars, saying: "${
          review.text
        }"`
    },
    Mutation: {
      createReview: (_, { review }) => {
        reviews.push(review)
        return review
      }
    }
  },
  dataSources: () => ({
    reviews: new Reviews(db.collection('reviews'))
  }),
  context: async ({ req }) => {
    const context = {}

    const jwt = req.headers.authorization
    const authId = await getAuthIdFromJWT(jwt)
    if (authId === 'github|1615') {
      context.user = {
        firstName: 'John',
        lastName: 'Resig'
      }
    }

    return context
  }
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`GraphQL server running at ${url}`))
