import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'

const isValid = date => !isNaN(date.getTime())

export default {
  Date: new GraphQLScalarType({
    name: 'Date',
    description:
      'The `Date` scalar type represents a single moment in time. It is serialized as an integer, equal to the number of milliseconds since the Unix epoch.',

    parseValue(value) {
      if (!Number.isInteger(value)) {
        throw new Error('Date values must be integers')
      }

      const date = new Date(value)
      if (!isValid(date)) {
        throw new Error('Invalid Date value')
      }

      return date
    },

    parseLiteral(ast) {
      if (ast.kind !== Kind.INT) {
        throw new Error('Date literals must be integers')
      }

      const date = new Date(parseInt(ast.value))
      if (!isValid) {
        throw new Error('Invalid Date literal')
      }

      return date
    },

    serialize(date) {
      if (!(date instanceof Date)) {
        throw new Error(
          'Resolvers for Date scalars must return JavaScript Date objects'
        )
      }

      if (!isValid(date)) {
        throw new Error('Invalid Date scalar')
      }

      return date.getTime()
    }
  })
}
