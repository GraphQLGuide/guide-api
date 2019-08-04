import { pubsub } from '../util/pubsub'

export default {
  Subscription: {
    githubStars: {
      subscribe: () => pubsub.asyncIterator('githubStars')
    }
  }
}
