import resolvers from './User'
import { InputError } from '../util/errors'

jest.mock('mongodb', () => ({
  ObjectId: id => {
    if (id === 'invalid') {
      throw new Error(
        'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters'
      )
    }
  }
}))

test('user throws InputError', () => {
  expect(() =>
    resolvers.Query.user(
      null,
      { id: 'invalid' },
      { dataSources: { users: { findOneById: jest.fn() } } }
    )
  ).toThrow(InputError)
})

test('user throws data source errors', () => {
  const MOCK_MONGO_ERROR = 'Unable to connect to DB'

  expect(() =>
    resolvers.Query.user(
      null,
      { id: 'foo' },
      {
        dataSources: {
          users: {
            findOneById: () => {
              throw new Error(MOCK_MONGO_ERROR)
            }
          }
        }
      }
    )
  ).toThrow(MOCK_MONGO_ERROR)
})
