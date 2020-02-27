import { ObjectId } from 'mongodb'

export const encodeCursor = review =>
  Buffer.from(review._id.toString()).toString('base64')

export const decodeCursor = cursor =>
  ObjectId(Buffer.from(cursor, 'base64').toString('ascii'))
