const articlesRouter = require("../routers/articles-router");
const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
} = require("../models/articles");
exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles().then((articles) => {
    console.log(articles);
    res.status(200).send({ articles });
  });
};
