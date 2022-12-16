const express = require("express");

const router = express.Router();
router.get("/version", async (req, res) => {
  res.status(200).send(process.env);
});

module.exports = {
  routerVersion: router,
};
