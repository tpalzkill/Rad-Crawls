exports.up = function(knex, Promise) {
  return knex.schema.createTable('challenges', (table) => {
    table.increments();
    table.string('challenge_name').notNullable();
    table.integer('bar_id').unsigned();
    table.foreign('bar_id').references('bars.id').onDelete('cascade');
    table.integer('points');
    table.string('type');
    table.string('challenge_text');
    table.string('image');
    table.boolean('completed');
    table.integer('completed_by').unsigned();
    table.foreign('completed_by').references('users.id').onDelete('cascade');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('challenges');
};
