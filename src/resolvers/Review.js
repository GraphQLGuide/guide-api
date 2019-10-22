export default {
  Query: {
    reviews: (_, __, { dataSources }) => dataSources.reviews.all()
  },
  Review: {
    id: review => review._id,
    fullReview: review =>
      `Someone on the internet gave ${review.stars} stars, saying: "${
        review.text
      }"`,
    createdAt: review => review._id.getTimestamp()
  },
  Mutation: {
    createReview: (_, { review }, { dataSources }) =>
      dataSources.reviews.create(review)
  }
}
