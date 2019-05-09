export default {
  Query: {
    me: (_, __, context) => context.user
  }
}
