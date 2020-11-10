exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next;
};

exports.handleInternalErrors = (err, req, res, next) => {
  console.log(`Unhandled error: ${err}`);
  req.status(500).send({ msg: "Internal server error" });
};
exports.send404 = (req, res, next) => {
  res.status(404).send({ msg: "Not found" });
};
