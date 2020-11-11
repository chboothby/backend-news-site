const connection = require("../db/connection");

exports.createNewComment = (article_id, username, body) => {
  return connection
    .insert({ article_id, author: username, body })
    .into("comments")
    .returning("*")
    .then((comment) => {
      return comment[0];
    });
};

exports.fetchAllComments = (article_id, sort_by, order) => {
  return connection
    .select("comment_id", "author", "votes", "created_at", "body")
    .from("comments")
    .where("article_id", "=", article_id)
    .orderBy(sort_by || "created_at", order || "asc");
};

exports.updateCommentById = (comment_id, inc_votes) => {
  return connection
    .select("*")
    .from("comments")
    .where("comment_id", "=", comment_id)
    .update({
      votes: connection.raw(`votes + ${inc_votes}`),
    })
    .returning("*")
    .then((comments) => {
      if (comments.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      } else return comments[0];
    });
};

exports.removeCommentById = (comment_id) => {
  return connection("comments").where("comment_id", "=", comment_id).del();
};
