import get from 'lodash/get'

export default error => {
  console.log(error)
  console.log(get(error, 'extensions.exception.stacktrace'))
  return error
}
