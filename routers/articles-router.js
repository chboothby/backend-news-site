const articlesRouter = require("express").Router();
const {
  getArticleById,
  patchArticleById,
  getAllArticles,
} = require("../controllers/articles");
const { postNewComment, getAllComments } = require("../controllers/comments");
articlesRouter.route("/").get(getAllArticles);
articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById);
articlesRouter
  .route("/:article_id/comments")
  .post(postNewComment)
  .get(getAllComments);
module.exports = articlesRouter;
