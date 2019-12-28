import get from 'lodash/get'

import { InternalServerError } from './util/errors'
import { inProduction } from './env'

export default error => {
  if (inProduction) {
    // send error to tracking service
  } else {
    console.log(error)
    console.log(get(error, 'extensions.exception.stacktrace'))
  }

  const name = get(error, 'extensions.exception.name') || ''
  if (name.startsWith('Mongo')) {
    return new InternalServerError()
  } else {
    return error
  }
}
