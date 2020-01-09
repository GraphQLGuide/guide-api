import Github from './Github'
import SQL from './SQL'

const knexConfig = {
  client: 'sqlite3',
  connection: {
    filename: './sql/dev.sqlite3'
  },
  useNullAsDefault: true
}

export const db = new SQL(knexConfig)

export default () => ({ db })

export { Github }
