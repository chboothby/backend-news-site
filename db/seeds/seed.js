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
      return knex.insert(topicData).into("topics").returning("*");
    })
    .then((topicsRows) => {
      // console.log(`inserted ${topicsRows.length} rows into topics table`);
      return knex.insert(userData).into("users").returning("*");
    })
    .then((userRows) => {
      // console.log(`inserted ${userRows.length} rows into users table`);
      const formattedArticles = formatDateAndTime(articleData);
      return knex.insert(formattedArticles).into("articles").returning("*");
    })
    .then((articleRows) => {
      // console.log(`inserted ${articleRows.length} into articles table`);
      const changedKey = changeKeyToAuthor(commentData);
      const formattedTime = formatDateAndTime(changedKey);
      const articleRef = createArticleRef(articleRows);
      const formattedComments = formatComments(articleRef, formattedTime);
      return knex.insert(formattedComments).into("comments").returning("*");
    })
    .then((formattedComments) => {
      // console.log(`inserted ${formattedComments.length} rows into comments table`);
    });
};
