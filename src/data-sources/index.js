import Reviews from './Reviews'
import { db } from '../db'

export default () => ({
  reviews: new Reviews(db.collection('reviews'))
})
