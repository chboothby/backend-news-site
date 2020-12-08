const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const {
  send404,
  handleInternalErrors,
  handleCustomErrors,
  handlePSQLErrors,
} = require("./controllers/errors");
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", send404);

app.use(handleCustomErrors);
app.use(handlePSQLErrors);
app.use(handleInternalErrors);

module.exports = app;
