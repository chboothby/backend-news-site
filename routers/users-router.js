const usersRouter = require("express").Router();
const { send405 } = require("../controllers/errors");
const { getUserByUsername } = require("../controllers/users");
usersRouter.route("/:username").get(getUserByUsername).all(send405);

module.exports = usersRouter;
