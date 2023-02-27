const express = require("express");
const fs = require("fs");
const path = require("path");
const childProcess = require("child_process");

const startDate = new Date();

const router = express.Router();
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

router.get("/version", async (req, res) => {
  const appVersion =
    process.env.APP_VERSION ||
    childProcess.execSync("git rev-parse --short HEAD").toString().trim();

  if ("hash" in req.query) {
    return res.send(appVersion);
  }
  if ("start" in req.query) {
    return res.send(startDate.toISOString());
  }

  const buildFileName = path.join(__dirname, "..", ".nuxt", "server.js");
  const fileStat = fs.statSync(buildFileName);
  if ("build" in req.query) {
    return res.send(fileStat.ctime.toISOString());
  }

  res.status(200).send({
    hash: appVersion,
    start: startDate,
    build: fileStat.ctime,
  });
});

module.exports = {
  routerVersion: router,
};
