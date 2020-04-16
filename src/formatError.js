import get from 'lodash/get'
import * as Sentry from '@sentry/node'
import { AuthenticationError, ForbiddenError } from 'apollo-server'

import { InternalServerError, InputError } from './util/errors'
import { inProduction } from './env'

Sentry.init({
  dsn: 'https://ceb14feec00b4c49bebd10a9674bb68d@sentry.io/5168151'
})

const NORMAL_ERRORS = [AuthenticationError, ForbiddenError, InputError]
const NORMAL_CODES = ['GRAPHQL_VALIDATION_FAILED']
const shouldReport = e =>
  !NORMAL_ERRORS.includes(e.originalError) &&
  !NORMAL_CODES.includes(get(e, 'extensions.code'))

export default error => {
  if (inProduction) {
    if (shouldReport(error)) {
      Sentry.captureException(error.originalError)
    }
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
