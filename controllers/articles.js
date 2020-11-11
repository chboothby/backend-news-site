const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles,
  createNewArticle,
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
  const { sort_by, order, author, topic } = req.query;
  fetchAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
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
