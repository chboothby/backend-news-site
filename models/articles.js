const connection = require("../db/connection");

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
      if (article.length === 0)
        return Promise.reject({ status: 404, msg: "Article not found" });
      return article[0];
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  if (inc_votes === undefined) {
    return Promise.reject({ status: 400, msg: "Invalid patch request" });
  }
  return connection
    .select("*")
    .from("articles")
    .where("article_id", "=", article_id)
    .update({
      votes: connection.raw(`votes + ${inc_votes}`),
    })
    .then(() => {
      return this.fetchArticleById(article_id);
    });
};
