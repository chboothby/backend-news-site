const {
  createNewComment,
  fetchAllComments,
  updateCommentById,
  removeCommentById,
} = require("../models/comments");

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
  const { sort_by, order, limit, page } = req.query;
  fetchAllComments(article_id, sort_by, order, limit, page)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id).then((rows) => {
    res.status(204).send();
  });
};
