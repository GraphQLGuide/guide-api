exports.seed = async knex => {
  await knex('users').del()
  await knex('users').insert([
    {
      id: 1,
      first_name: 'John',
      last_name: 'Resig',
      username: 'jeresig',
      email: 'john@graphql.guide',
      auth_id: 'github|1615',
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
