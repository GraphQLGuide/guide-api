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
    context: () => ({ user: { id: 'itme' } })
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

  const id = mockUser.id
  const result = await query({
    query: USER,
    variables: { id }
  })
  expect(result.data.user.id).toEqual(id.toString())
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

  const user = {
    firstName: mockUser.first_name,
    lastName: mockUser.last_name,
    username: mockUser.username,
    email: mockUser.email,
    authId: mockUser.auth_id
  }

  const result = await mutate({
    mutation: CREATE_USER,
    variables: {
      user,
      secretKey: process.env.SECRET_KEY
    }
  })

  expect(result).toMatchSnapshot()
})
