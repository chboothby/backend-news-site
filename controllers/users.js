const { fetchUserByUsername } = require("../models/users");
exports.getUserByUsername = (req, res, next) => {
  const username = req.params.username;
  fetchUserByUsername(username).then((user) => {
    console.log({ user: user[0] });
    res.status(200).send({ user: user[0] });
  });
};
