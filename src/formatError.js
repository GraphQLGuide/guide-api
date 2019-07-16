import get from 'lodash/get'

const inProduction = process.env.NODE_ENV === 'production'

export default error => {
  if (inProduction) {
    // send error to tracking service
  } else {
    console.log(error)
    console.log(get(error, 'extensions.exception.stacktrace'))
  }

  const name = get(error, 'extensions.exception.name') || ''
  if (name.startsWith('Mongo')) {
    return new Error('Internal server error')
  } else {
    return error
  }
}
