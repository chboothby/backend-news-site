const connection = require("../db/connection");

exports.createNewComment = (article_id, username, body) => {
  return connection
    .insert({ article_id, author: username, body })
    .into("comments")
    .returning("*");
};

exports.fetchAllComments = (article_id, sort_by, order) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "asc");
};
