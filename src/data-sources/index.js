import Github from './Github'
import SQL from './SQL'
import Knex from 'knex'

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './sql/dev.sqlite3'
  },
  useNullAsDefault: true
}

export const knex = Knex(knexConfig)

export const db = new SQL(knexConfig)

export default () => ({ db })

export { Github }
