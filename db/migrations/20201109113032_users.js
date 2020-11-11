exports.up = function (knex) {
  // console.log('creating the users table...');
  return knex.schema.createTable("users", (usersTable) => {
    usersTable.text("username").unique();
    usersTable.text("name");
    usersTable.text("avatar_url");
  });
};

exports.down = function (knex) {
  // console.log('dropping the users table...');
  return knex.schema.dropTable("users");
};
