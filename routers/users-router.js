const usersRouter = require("express").Router();
const { send405 } = require("../controllers/errors");
const {
  getUserByUsername,
  postNewUser,
  getAllUsers,
} = require("../controllers/users");
usersRouter.route("/").post(postNewUser).get(getAllUsers).all(send405);
usersRouter.route("/:username").get(getUserByUsername).all(send405);

module.exports = usersRouter;
