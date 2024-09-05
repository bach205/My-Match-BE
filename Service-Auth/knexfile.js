import "dotenv/config";
// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {
  development: {
    client: 'mysql2',
    connection: {
      database: DEVELOPMENT_KNEX_DATABASE,
      user: DEVELOPMENT_KNEX_USERNAME,
      password: DEVELOPMENT_KNEX_PASSWORD,
      port: process.env.DEVELOPMENT_KNEX_PORT
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: "./src/migrations"
    }
  }

};
