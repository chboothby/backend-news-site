const {
  fetchUserByUsername,
  createNewUser,
  fetchAllUsers,
} = require("../models/users");

exports.getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postNewUser = (req, res, next) => {
  const newUser = req.body;
  createNewUser(newUser)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers().then((users) => {
    res.status(200).send({ users });
  });
};
