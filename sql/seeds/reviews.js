exports.seed = async knex => {
  await knex('reviews').del()
  await knex('reviews').insert([
    {
      id: 1,
      author_id: 1,
      text: `Now that's a downtown job!`,
      stars: 5,
      created_at: new Date(),
      updated_at: new Date()
    },
    {
      id: 2,
      author_id: 1,
      text: 'Passable',
      stars: 3,
      created_at: new Date(),
      updated_at: new Date()
    }
  ])
}
