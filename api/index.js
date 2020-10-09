const express = require("express");
const app = express();
const data = require("./data.js");

app.use(express.json());

app.get("/cities", (req, res) => {
  res.send(data.cities);
});

module.exports = {
  path: "/api",
  handler: app,
};
