const { send405 } = require("../controllers/errors");

const topicsRouter = require("express").Router();
const { getAllTopics } = require("../controllers/topics");

topicsRouter.route("/").get(getAllTopics).all(send405);

module.exports = topicsRouter;
