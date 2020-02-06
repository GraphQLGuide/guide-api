const BOOK_PRICE = 3900

export default {
  Query: {
    costInCents: async (_, __, { dataSources }) =>
      Math.round((await dataSources.ppp.getConversionFactor()) * BOOK_PRICE)
  }
}
