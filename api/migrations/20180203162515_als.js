
exports.up = function(knex, Promise) {
  return knex.schema.createTable('parties', (table) => {
    table.increments();
    table.string('party_name').notNullable();
    table.integer('partyleader').unsigned();
    table.foreign('partyleader').references('users.id').onDelete('cascade');
    table.json('comments');
    table.boolean('teams');
    table.boolean('complete');
    table.string('team_names')
    table.string('team_a')
    table.string('team_b')
    table.integer('user_score').unsigned();
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('parties');
};
