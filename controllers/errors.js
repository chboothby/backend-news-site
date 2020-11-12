exports.handlePSQLErrors = (err, req, res, next) => {
  console.log(err.code, "err code");
  const badReqCodes = ["22P02", "42703", "23503", "2201X"];
  const missingDataCodes = ["23502"];
  if (badReqCodes.includes(err.code)) {
    res.status(400).send({ msg: "Bad request" });
  } else if (missingDataCodes.includes(err.code)) {
    res.status(400).send({ msg: "Incomplete request" });
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

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Invalid method" });
};
