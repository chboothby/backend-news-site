exports.up = function (knex) {
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.text("title").notNullable();
    articlesTable.text("author").references("users.username").notNullable();
    articlesTable.text("body").notNullable();
    articlesTable.text("topic").references("topics.slug");
    articlesTable.timestamp("created_at").defaultTo(knex.fn.now());
    articlesTable.integer("votes").defaultTo(0);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("articles");
};
