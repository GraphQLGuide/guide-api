export default async ({ req }) => {
  const context = {}

  const userDocString = req && req.headers['user']
  if (userDocString) {
    context.user = JSON.parse(userDocString)
  }

  return context
}
