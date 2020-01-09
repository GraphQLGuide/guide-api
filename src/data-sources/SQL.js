import { SQLDataSource } from 'datasource-sql'

const REVIEW_TTL = 60 // minute
const USER_TTL = 60 * 60 // hour

class SQL extends SQLDataSource {
  getReviews() {
    return this.knex
      .select('*')
      .from('reviews')
      .cache(REVIEW_TTL)
  }

  async createReview(review) {
    review.author_id = this.context.user.id
    review.created_at = Date.now()
    review.updated_at = Date.now()
    const [id] = await this.knex
      .returning('id')
      .insert(review)
      .into('reviews')
    review.id = id
    return review
  }

  async createUser(user) {
    const newUser = {
      first_name: user.firstName,
      last_name: user.lastName,
      username: user.username,
      email: user.email,
      auth_id: user.authId,
      created_at: Date.now(),
      updated_at: Date.now()
    }

    const [id] = await this.knex
      .returning('id')
      .insert(newUser)
      .into('users')
    newUser.id = id

    return newUser
  }

  async getUser(where) {
    const [user] = await this.knex
      .select('*')
      .from('users')
      .where(where)
      .cache(USER_TTL)

    return user
  }

  searchUsers(term) {
    return this.knex
      .select('*')
      .from('users')
      .where('first_name', 'like', `%${term}%`)
      .orWhere('last_name', 'like', `%${term}%`)
      .orWhere('username', 'like', `%${term}%`)
      .cache(USER_TTL)
  }
}

export default SQL
