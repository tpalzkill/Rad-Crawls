
exports.up = function(knex, Promise) {
  return knex.schema.createTable('users_challenge', (table) => {
  table.integer('user_id').unsigned();
  table.foreign('user_id').references('users.id').onDelete('cascade');
  table.integer('challenge_id').unsigned();
  table.foreign('challenge_id').references('challenges.id').onDelete('cascade');
  table.timestamps(true, true);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('users_challenge');
};
