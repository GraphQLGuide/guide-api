import { AuthenticationError } from 'apollo-server'
import { mockUser } from 'guide-test-utils'

import getContext from './context'
import { getAuthIdFromJWT } from './util/auth'

jest.mock('./util/auth', () => ({
  getAuthIdFromJWT: jest.fn(jwt => (jwt === 'valid' ? mockUser.auth_id : null))
}))

jest.mock('./data-sources/', () => ({
  db: {
    getUser: ({ auth_id }) => (auth_id === mockUser.auth_id ? mockUser : null)
  }
}))

describe('context', () => {
  afterEach(() => {
    getAuthIdFromJWT.mockClear()
  })

  it('finds a user given a valid jwt', async () => {
    const context = await getContext({
      req: { headers: { authorization: 'valid' } }
    })

    expect(getAuthIdFromJWT.mock.calls.length).toBe(1)
    expect(context.user).toMatchSnapshot()
  })

  it('throws error on invalid jwt', async () => {
    const promise = getContext({
      req: { headers: { authorization: 'invalid' } }
    })

    expect(getAuthIdFromJWT.mock.calls.length).toBe(1)
    expect(promise).rejects.toThrow(AuthenticationError)
  })

  it('is empty without jwt', async () => {
    const context = await getContext({
      req: { headers: {} }
    })

    expect(getAuthIdFromJWT.mock.calls.length).toBe(0)
    expect(context).toEqual({})
  })
})
