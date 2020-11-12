const connection = require("../db/connection");
const { checkTopicExists } = require("./topics");
const { checkAuthorExists } = require("./users");

exports.fetchArticleById = (article_id) => {
  return connection
    .select("articles.*")
    .from("articles")
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")

    .where("articles.article_id", "=", article_id)
    .count("comments.article_id AS comment_count")
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

exports.fetchAllArticles = (sort_by, order, author, topic) => {
  return connection
    .select(
      "articles.author",
      "title",
      "articles.article_id",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .modify((queryBuilder) => {
      if (author) {
        queryBuilder.where("articles.author", "LIKE", author);
      }
      if (topic) {
        queryBuilder.where("articles.topic", "LIKE", topic);
      }
    })
    .from("articles")
    .leftJoin("comments", "comments.article_id", "articles.article_id")
    .groupBy(
      "articles.author",
      "articles.title",
      "articles.body",
      "articles.article_id"
    )
    .count("comments.article_id AS comment_count")
    .orderBy(sort_by || "created_at", order || "desc")
    .then((articles) => {
      if (articles.length === 0) {
        return Promise.all([articles, checkAuthorExists(author)]);
        //return Promise.reject({ status: 404, msg: "No articles found" });
      } else return [articles, true];
    })
    .then((result) => {
      const [articles, authorExists] = result;
      if (!authorExists) {
        return Promise.reject({
          status: 404,
          msg: "Author does not exist",
        });
      }
      return articles;
    });
};

exports.createNewArticle = (articleInfo) => {
  return connection
    .insert(articleInfo)
    .into("articles")
    .returning("*")
    .then((article) => {
      return article[0];
    });
};
