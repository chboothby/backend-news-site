const { fetchAPI } = require("../models/api");

exports.getAPI = (req, res, next) => {
  fetchAPI().then((API) => {
    res.status(200).send({ API });
  });
};
