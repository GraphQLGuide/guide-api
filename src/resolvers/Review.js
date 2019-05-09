export default {
  Query: {
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
}
