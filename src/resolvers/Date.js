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

      return value
    },

    parseLiteral(ast) {
      if (ast.kind !== Kind.INT) {
        throw new Error('Date literals must be integers')
      }

      const dateInt = parseInt(ast.value)
      const date = new Date(dateInt)
      if (!isValid(date)) {
        throw new Error('Invalid Date literal')
      }

      return dateInt
    },

    serialize(date) {
      if (!Number.isInteger(date)) {
        throw new Error('Resolvers for Date scalars must return integers')
      }

      if (!isValid(new Date(date))) {
        throw new Error('Invalid Date scalar')
      }

      return date
    }
  })
}
