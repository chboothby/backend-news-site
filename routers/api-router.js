const apiRouter = require("express").Router();
const articlesRouter = require("./articles-router");
const topicsRouter = require("./topics-router");
const usersRouter = require("./users-router");
const commentsRouter = require("./comments-router");
const { send405 } = require("../controllers/errors");
const { getAPI } = require("../controllers/api");

apiRouter.route("/").get(getAPI).all(send405);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);
apiRouter.use("/comments", commentsRouter);

module.exports = apiRouter;
