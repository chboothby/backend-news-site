const {
  createNewComment,
  fetchAllComments,
  updateCommentById,
  removeCommentById,
  fetchNumberOfComments,
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
  Promise.all([
    fetchAllComments(article_id, sort_by, order, limit, page),
    fetchNumberOfComments(article_id),
  ])
    .then((results) => {
      const comments = results[0];
      const total_count = results[1];
      res.status(200).send({ comments, total_count });
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
