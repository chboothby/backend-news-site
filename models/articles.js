const connection = require("../db/connection");
const articlesRouter = require("../routers/articles-router");

exports.fetchArticleById = (article_id) => {
  return connection
    .select(
      "users.name AS author",
      "title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )

    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .join("users", "users.username", "articles.author")
    .groupBy(
      "users.name",
      "articles.title",
      "articles.body",
      "articles.article_id"
    )

    .where("articles.article_id", "=", article_id)
    .sum("comments.article_id AS comment_count")
    .then((article) => {
      return article[0];
    });
};
