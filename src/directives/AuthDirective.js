import { SchemaDirectiveVisitor, ForbiddenError } from 'apollo-server'
import { defaultFieldResolver } from 'graphql'

export default class AuthDirective extends SchemaDirectiveVisitor {
  visitObject(objectType) {
    objectType._requiredRole = this.args.requires

    const fields = objectType.getFields()
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName]
      this._wrapResolveFn(field, objectType)
    })

    objectType._wrappedResolveFn = true
  }

  visitFieldDefinition(field, { objectType }) {
    field._requiredRole = this.args.requires

    const alreadyWrapped = objectType._wrappedResolveFn
    if (!alreadyWrapped) {
      this._wrapResolveFn(field, objectType)
    }
  }

  _wrapResolveFn(field, objectType) {
    const { resolve = defaultFieldResolver } = field

    field.resolve = (...args) => {
      const requiredRole = field._requiredRole || objectType._requiredRole
      const context = args[2]

      console.log(context.user.roles)
      console.log(requiredRole)
      if (!context.user.roles.includes(requiredRole)) {
        throw new ForbiddenError(`You don't have permission to view this data.`)
      }

      return resolve.apply(null, args)
    }
  }
}
