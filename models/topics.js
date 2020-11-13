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

exports.createNewTopic = ({ slug, description }) => {
  return connection
    .insert({ slug, description })
    .into("topics")
    .returning("*")
    .then((topic) => {
      return topic[0];
    });
};
