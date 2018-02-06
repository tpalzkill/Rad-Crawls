
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user_party', (table) => {
table.integer('user_id').references('users.id').onDelete('cascade');
table.integer('party_id').references('parties.id').onDelete('cascade');
table.boolean('response')
})
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user_party');
};
