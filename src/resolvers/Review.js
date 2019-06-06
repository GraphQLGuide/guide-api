export default {
  Query: {
    reviews: (_, __, { dataSources }) => dataSources.reviews.all()
  },
  Review: {
    id: review => review._id,
    author: (review, _, { dataSources }) =>
      dataSources.users.findOneById(review.authorId),
    fullReview: async (review, _, { dataSources }) => {
      const author = await dataSources.users.findOneById(review.authorId)
      return `${author.firstName} ${author.lastName} gave ${
        review.stars
      } stars, saying: "${review.text}"`
    },
    createdAt: review => review._id.getTimestamp()
  },
  Mutation: {
    createReview: (_, { review }, { dataSources }) =>
      dataSources.reviews.create(review)
  }
}
