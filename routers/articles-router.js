const articlesRouter = require("express").Router();
const { send405 } = require("../controllers/errors");
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
  postNewArticle,
  deleteArticleById,
} = require("../controllers/articles");

const { postNewComment, getAllComments } = require("../controllers/comments");
articlesRouter.route("/").get(getAllArticles).post(postNewArticle).all(send405);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .delete(deleteArticleById)
  .all(send405);
articlesRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(getAllComments)
  .all(send405);

module.exports = articlesRouter;
