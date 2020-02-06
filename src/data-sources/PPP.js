import { RESTDataSource } from 'apollo-datasource-rest'

export default class PPP extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = `https://ppp.graphql.guide`
  }

  async getConversionFactor() {
    const { countryCode } = this.context
    if (!countryCode) {
      return 1
    }

    const data = await this.get('/', { country: countryCode })
    return data.pppConversionFactor || 1
  }
}
