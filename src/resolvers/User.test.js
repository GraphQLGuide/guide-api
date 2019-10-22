import { pick } from 'lodash'
import {
  createTestServer,
  createTestClient,
  gql,
  mockUser
} from 'guide-test-utils'

const ME = gql`
  query {
    me {
      id
    }
  }
`

test('me', async () => {
  const { server } = createTestServer({
    context: () => ({ user: { _id: 'itme' } })
  })
  const { query } = createTestClient(server)

  const result = await query({ query: ME })
  expect(result.data.me.id).toEqual('itme')
})

const USER = gql`
  query User($id: ID!) {
    user(id: $id) {
      id
    }
  }
`

test('user', async () => {
  const { server } = createTestServer()
  const { query } = createTestClient(server)

  const id = mockUser._id.toString()
  const result = await query({
    query: USER,
    variables: { id }
  })
  expect(result.data.user.id).toEqual(id)
})

const SEARCH_USERS = gql`
  query SearchUsers($term: String!) {
    searchUsers(term: $term) {
      ... on User {
        id
      }
    }
  }
`

test('searchUsers', async () => {
  const userA = { _id: 'A' }
  const userB = { _id: 'B' }
  const { server, dataSources } = createTestServer()

  dataSources.users.users.find.mockReturnValueOnce({
    toArray: jest.fn().mockResolvedValue([userA, userB])
  })

  const { query } = createTestClient(server)

  const result = await query({
    query: SEARCH_USERS,
    variables: { term: 'foo' }
  })

  expect(dataSources.users.users.find).toHaveBeenCalledWith({
    $text: { $search: 'foo' }
  })
  expect(result.data.searchUsers[0].id).toEqual('A')
  expect(result.data.searchUsers[1].id).toEqual('B')
})

const CREATE_USER = gql`
  mutation CreateUser($user: CreateUserInput!, $secretKey: String!) {
    createUser(user: $user, secretKey: $secretKey) {
      id
    }
  }
`

test('createUser', async () => {
  const { server } = createTestServer()
  const { mutate } = createTestClient(server)

  const user = pick(mockUser, [
    'firstName',
    'lastName',
    'username',
    'email',
    'authId'
  ])

  const result = await mutate({
    mutation: CREATE_USER,
    variables: {
      user,
      secretKey: process.env.SECRET_KEY
    }
  })

  expect(result).toMatchSnapshot()
})
