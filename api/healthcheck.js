const express = require("express");

const router = express.Router();

router.get("/healthcheck", async (req, res) => {
  res.status(200).send();
});

module.exports = {
  routerHealthcheck: router,
};
