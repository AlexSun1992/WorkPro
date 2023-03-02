const express = require("express");
const app = express();
const data = require("./data.js");

app.use(express.json());
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

app.get("/cities", (req, res) => {
  res.send(data.cities);
});

module.exports = {
  path: "/api",
  handler: app,
};
