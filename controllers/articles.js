const articlesRouter = require("../routers/articles-router");
const { fetchArticleById } = require("../models/articles");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id).then((article) => {
    res.status(200).send({ article });
  });
};
