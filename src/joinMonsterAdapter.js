import joinMonsterAdapt from 'join-monster-graphql-tools-adapter'

export default schema =>
  joinMonsterAdapt(schema, {
    Query: {
      fields: {
        user: {
          where: (table, args) => `${table}.id = ${args.id}`
        }
      }
    },
    Review: {
      sqlTable: 'reviews',
      uniqueKey: 'id',
      fields: {
        author: {
          sqlJoin: (reviewTable, userTable) =>
            `${reviewTable}.author_id = ${userTable}.id`
        },
        text: { sqlColumn: 'text' },
        stars: { sqlColumn: 'stars' },
        fullReview: { sqlDeps: ['text', 'stars', 'author_id'] },
        createdAt: { sqlColumn: 'created_at' },
        updatedAt: { sqlColumn: 'updated_at' }
      }
    },
    User: {
      sqlTable: 'users',
      uniqueKey: 'id',
      fields: {
        firstName: { sqlColumn: 'first_name' },
        lastName: { sqlColumn: 'last_name' },
        createdAt: { sqlColumn: 'created_at' },
        updatedAt: { sqlColumn: 'updated_at' },
        photo: { sqlDeps: ['auth_id'] }
      }
    }
  })
