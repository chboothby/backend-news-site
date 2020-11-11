const commentsRouter = require("express").Router();
const {
  patchCommentById,
  deleteCommentById,
} = require("../controllers/comments");

const { send405 } = require("../controllers/errors");
commentsRouter
  .route("/:comment_id")
  .patch(patchCommentById)
  .delete(deleteCommentById)
  .all(send405);
module.exports = commentsRouter;
