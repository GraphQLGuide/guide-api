import { MongoDataSource } from 'apollo-datasource-mongodb'

export default class Users extends MongoDataSource {
  constructor(collection) {
    super(collection)

    this.collection.createIndex({
      firstName: 'text',
      lastName: 'text',
      username: 'text'
    })
  }

  create(user) {
    user.updatedAt = new Date()
    this.collection.insertOne(user)
    return user
  }

  search(term) {
    return this.collection.find({ $text: { $search: term } }).toArray()
  }

  async setPhoto(path) {
    const { user } = this.context
    const photo = `https://res.cloudinary.com/graphql/${path}`
    await this.collection.updateOne({ _id: user._id }, { $set: { photo } })
    return {
      ...user,
      photo
    }
  }
}
