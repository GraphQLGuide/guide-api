import { ApolloError } from 'apollo-server'

export class InternalServerError extends ApolloError {
  constructor() {
    super(
      `We're sorry—an error occurred. We've been notified and will look into it.`,
      'INTERNAL_SERVER_ERROR'
    )

    Object.defineProperty(this, 'name', { value: 'InternalServerError' })
  }
}

export class InputError extends ApolloError {
  constructor(errors) {
    let messages = []

    for (const arg in errors) {
      if (typeof errors[arg] === 'string') {
        // scalar argument
        const errorMessage = errors[arg]
        messages.push(`Argument ${arg} is invalid: ${errorMessage}.`)
      } else {
        // object argument
        const errorObject = errors[arg]
        for (const prop in errorObject) {
          const errorMessage = errorObject[prop]
          messages.push(`Argument ${arg}.${prop} is invalid: ${errorMessage}.`)
        }
      }
    }

    const message = messages.join(' ')

    super(message, 'INVALID_INPUT', { invalidArgs: errors })

    Object.defineProperty(this, 'name', { value: 'InputError' })
  }
}
