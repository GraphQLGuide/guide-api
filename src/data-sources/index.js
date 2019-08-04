import Reviews from './Reviews'
import Users from './Users'
import Github from './Github'
import { db } from '../db'

Github.startPolling()

export default () => ({
  reviews: new Reviews(db.collection('reviews')),
  users: new Users(db.collection('users'))
})
