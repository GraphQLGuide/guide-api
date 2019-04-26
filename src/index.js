import { ApolloServer, gql } from 'apollo-server'

const reviews = [
  {
    text: 'Super-duper book.',
    stars: 5
  }
]

const server = new ApolloServer({
  typeDefs: gql`
    type Query {
      hello: String!
      reviews: [Review!]!
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
      hello: () => '🌍🌏🌎',
      reviews: () => reviews
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
  }
})

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`GraphQL server running at ${url}`))
