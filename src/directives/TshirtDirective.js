import { SchemaDirectiveVisitor } from 'apollo-server'

export default class TshirtDirective extends SchemaDirectiveVisitor {
  visitEnumValue(value) {
    value.description += ' Includes a T-shirt 😄'
    return value
  }
}
