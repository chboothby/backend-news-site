const { createNewComment, fetchAllComments } = require("../models/comments");

exports.postNewComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  createNewComment(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.getAllComments = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by, order } = req.query;
  fetchAllComments(article_id, sort_by, order).then((comments) => {
    res.status(200).send({ comments });
  });
};
