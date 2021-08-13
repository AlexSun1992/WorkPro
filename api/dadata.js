/* eslint-disable */

const express = require("express");
const app = express();
const axios = require("axios");

app.use(express.json());

app.post("/suggestions/:address", async (req, res) => {
  try {
    const { data } = await axios.post(
      `https://dadata.reso.ru/suggestions/api/4_1/rs/suggest/${req.params.address}`,
      req.body
    );
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = {
  path: "/api",
  handler: app,
};
