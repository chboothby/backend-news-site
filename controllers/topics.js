const { fetchAllTopics, createNewTopic } = require("../models/topics");
exports.getAllTopics = (req, res, next) => {
  fetchAllTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

exports.postNewTopic = (req, res, next) => {
  const topicData = req.body;
  createNewTopic(topicData)
    .then((topic) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
