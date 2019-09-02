import {
  createTestServer,
  createTestClient,
  gql,
  mockUser
} from 'guide-test-utils'

const REVIEWS = gql`
  query {
    reviews {
      id
      text
      stars
      author {
        id
        firstName
        lastName
        username
        photo
        createdAt
        updatedAt
      }
      createdAt
      updatedAt
    }
  }
`

test('reviews', async () => {
  const { server } = createTestServer()
  const { query } = createTestClient(server)

  const result = await query({ query: REVIEWS })
  expect(result).toMatchSnapshot()
})

const CREATE_REVIEW = gql`
  mutation CreateReview($review: CreateReviewInput!) {
    createReview(review: $review) {
      id
      text
      stars
      author {
        id
        email
      }
      createdAt
    }
  }
`

test('createReview', async () => {
  const { server } = createTestServer({
    context: () => ({ user: mockUser })
  })
  const { mutate } = createTestClient(server)

  const result = await mutate({
    mutation: CREATE_REVIEW,
    variables: { review: { text: 'test', stars: 1 } }
  })
  expect(result).toMatchSnapshot()
})
