const connection = require("../db/connection");
exports.fetchAllTopics = () => {
  return connection.select("*").from("topics");
};

exports.checkTopicExists = (topic) => {
  console.log(topic);
  return connection.select("*").from("topics").where("slug", "LIKE", topic);
};
