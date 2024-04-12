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
  const appBranch =
    process.env.APP_VERSION_BRANCH ||
    childProcess.execSync("git rev-parse --abbrev-ref HEAD").toString().trim();
  const appVersion =
    process.env.APP_VERSION ||
    childProcess.execSync("git rev-parse --short HEAD").toString().trim();
  const versionDate =
    process.env.APP_VERSION_DATE ||
    childProcess
      .execSync("git show -s --date=format:%Y-%m-%dT%H:%M:%S.000Z --format=%cd")
      .toString()
      .trim();
      
  if ("hash" in req.query) {
    return res.send(appVersion);
  }
  if ("start" in req.query) {
    return res.send(startDate.toISOString());
  }
  if ("build" in req.query) {
    return res.send(versionDate);
  }
  if ("appBranch" in req.query) {
    return res.send(appBranch);
  }
  const sendData = {
    hash: appVersion,
    start: startDate,
    version: process.env.npm_package_version,
    versionDate: new Date(versionDate).toISOString(),
  };
  if (!appBranch.startsWith("v")) {
    sendData.appBranch = appBranch;
  }
  res.status(200).send(sendData);
});

module.exports = {
  routerVersion: router,
};
