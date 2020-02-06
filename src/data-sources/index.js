import Reviews from './Reviews'
import Users from './Users'
import Github from './Github'
import PPP from './PPP'
import { db } from '../db'

export default () => ({
  reviews: new Reviews(db.collection('reviews')),
  users: new Users(db.collection('users')),
  ppp: new PPP()
})

export { Reviews, Users, Github, PPP }
