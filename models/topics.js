const connection = require("../db/connection");
exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.checkTopicExists = (topic) => {
  return connection
    .select("*")
    .from("topics")
    .where("slug", "LIKE", topic)
    .then((topics) => {
      return topics.length === 0 ? false : true;
    });
};
