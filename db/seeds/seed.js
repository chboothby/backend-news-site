const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");
const {
  formatDateAndTime,
  changeKeyToAuthor,
  createArticleRef,
  formatComments,
} = require("../utils/data-manipulation");

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => {
      return knex.migrate.latest();
    })
    .then(() => {
      const insertTopics = knex.insert(topicData).into("topics").returning("*");
      const insertUsers = knex.insert(userData).into("users").returning("*");

      return Promise.all([insertTopics, insertUsers]);
    })
    .then(() => {
      const formattedArticles = formatDateAndTime(articleData);
      return knex.insert(formattedArticles).into("articles").returning("*");
    })
    .then((articleRows) => {
      const changedKey = changeKeyToAuthor(commentData);
      const formattedTime = formatDateAndTime(changedKey);
      const articleRef = createArticleRef(articleRows);
      const formattedComments = formatComments(articleRef, formattedTime);
      return knex.insert(formattedComments).into("comments").returning("*");
    });
};
