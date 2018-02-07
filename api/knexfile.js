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
      tableName: 'knex_migrations',
      
    }
  },

  production: {
    client: 'pg',
    connection: {
      host: 'ec2-54-235-66-81.compute-1.amazonaws.com'
      database: 'd66kmlk081heh',
      user:     'jzykhpnvaosymj',
      password: '59241c39332c8f322144cbf1c63e1342657fd073a7147540293afb5754bfb3d4'
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
