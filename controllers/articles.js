const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
  createNewArticle,
  removeArticleById,
  fetchArticleCount,
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
  const { sort_by, order, author, topic, limit, page } = req.query;
  Promise.all([
    fetchAllArticles(sort_by, order, author, topic, limit, page),
    fetchArticleCount(author, topic),
  ])
    .then((result) => {
      const articles = result[0];
      const total_count = result[1];
      res.status(200).send({ articles, total_count });
    })
    .catch(next);
};

exports.postNewArticle = (req, res, next) => {
  const articleInfo = req.body;

  createNewArticle(articleInfo)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch(next);
};

exports.deleteArticleById = (req, res, next) => {
  const { article_id } = req.params;
  removeArticleById(article_id)
    .then((response) => {
      res.status(204).send();
    })
    .catch(next);
};
