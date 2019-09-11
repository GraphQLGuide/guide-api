import { gql, startE2EServer } from 'guide-test-utils'

let stop, request

beforeAll(async () => {
  const server = await startE2EServer()
  stop = server.stop
  request = server.request
})

afterAll(() => stop())

const HELLO = gql`
  query {
    hello
  }
`

test('hello', async () => {
  const result = await request({ query: HELLO })

  expect(result).toMatchSnapshot()
})
