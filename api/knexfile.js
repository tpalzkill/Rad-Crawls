// Update with your config settings.

module.exports = {

  development: {
    client: 'pg',
        connection: {
          database: 'rad_crawls',
          user:     '',
          password: '',
          host: '127.0.0.1'
        }
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      host: 'ec2-107-22-241-243.compute-1.amazonaws.com',
      database: 'dagrekaou6578j',
      user:     'kqpeybdrdffizn',
      password: 'f9f20a77cb7aec412792f60a067151fd889cf644dff139c3d59c45e3c6f77fc9'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
