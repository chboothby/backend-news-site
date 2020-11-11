exports.up = function (knex) {
  // console.log("creating the articles table...");
  return knex.schema.createTable("articles", (articlesTable) => {
    articlesTable.increments("article_id").primary();
    articlesTable.text("title");
    articlesTable.text("author").references("users.username");
    articlesTable.text("body");
    articlesTable.text("topic").references("topics.slug");
    articlesTable.timestamp("created_at");
    articlesTable.integer("votes").defaultTo(0);
  });
};

exports.down = function (knex) {
  // console.log("dropping the articles...");
  return knex.schema.dropTable("articles");
};
