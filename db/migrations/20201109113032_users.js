exports.up = function (knex) {
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").unique().notNullable();
    usersTable.text("name").notNullable();
    usersTable.text("avatar_url");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("users");
};
