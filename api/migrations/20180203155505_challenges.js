
exports.up = function(knex, Promise) {
  return knex.schema.createTable('bars', (table) => {
    table.increments();
    table.string('bar_name').notNullable();
    table.string('coordinates');
    table.integer('checkins');
    table.float('rating');
    table.string('description');
    table.string('image');
    table.string('keywords');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('bars');
};
