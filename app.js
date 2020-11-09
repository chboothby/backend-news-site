const express = require("express");
const app = express();
const apiRouter = require("./routers/api-router");
const { send404, handleInternalErrors } = require("./controllers/errors");

app.use(express.json());
app.use("/api", apiRouter);

app.all("/*", send404);
app.use(handleInternalErrors);

module.exports = app;
