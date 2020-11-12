const connection = require("../db/connection");
exports.fetchUserByUsername = (username) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "LIKE", username)
    .then((user) => {
      if (user.length === 0)
        return Promise.reject({ status: 404, msg: "User not found" });
      return user[0];
    });
};

exports.checkAuthorExists = (author) => {
  return connection
    .select("*")
    .from("users")
    .where("username", "LIKE", author)
    .then((users) => {
      return users.length === 0 ? false : true;
    });
};

exports.createNewUser = ({ username, name, avatar_url }) => {
  return connection
    .insert({ username, name, avatar_url })
    .into("users")
    .returning("*")
    .then((user) => {
      return user[0];
    });
};

exports.fetchAllUsers = () => {
  return connection.select("*").from("users");
};
