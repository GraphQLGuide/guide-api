import { GraphQLClient } from 'graphql-request'

import { pubsub } from '../util/pubsub'

const githubAPI = new GraphQLClient('https://api.github.com/graphql', {
  headers: {
    authorization: `bearer ${process.env.GITHUB_TOKEN}`
  }
})

const GUIDE_STARS_QUERY = `
query GuideStars {
  repository(owner: "GraphQLGuide", name: "guide") {
    stargazers {
      totalCount
    }
  }
}
`

export default {
  async fetchStarCount() {
    const data = await githubAPI.request(GUIDE_STARS_QUERY).catch(console.log)
    return data && data.repository.stargazers.totalCount
  },

  startPolling() {
    let lastStarCount

    setInterval(async () => {
      const starCount = await this.fetchStarCount()
      const countChanged = starCount && starCount !== lastStarCount

      if (countChanged) {
        pubsub.publish('githubStars', { githubStars: starCount })
        lastStarCount = starCount
      }
    }, 1000)
  }
}
