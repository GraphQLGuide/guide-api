exports.up = async knex => {
  await knex.schema.createTable('users', table => {
    table.increments('id')
    table.string('first_name').notNullable()
    table.string('last_name').notNullable()
    table.string('username').notNullable()
    table.string('email')
    table
      .string('auth_id')
      .notNullable()
      .unique()
    table.datetime('suspended_at')
    table.datetime('deleted_at')
    table.integer('duration_in_days')
    table.timestamps()
  })
  await knex.schema.createTable('reviews', table => {
    table.increments('id')
    table
      .integer('author_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('users')
    table.string('text').notNullable()
    table.integer('stars').unsigned()
    table.timestamps()
  })
}

exports.down = async knex => {
  await knex.schema.dropTable('users')
  await knex.schema.dropTable('reviews')
}
