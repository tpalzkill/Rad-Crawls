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
      host: 'node -r dotenv/config -r babel-register src/index.js',
      database: 'dd1e0dddplk40f',
      user:     'gxihngrkwbwrwe',
      password: '664d366f082eea8912c5cad107544f65117e2918498ca893659afa1513bed2ad'
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
