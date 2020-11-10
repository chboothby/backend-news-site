exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err.code);
  const badReqCodes = ["22P02", "42703"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else next(err);
};
exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(`Unhandled error: ${err}`);
  res.status(500).send({ msg: "Internal server error" });
};
exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
};
