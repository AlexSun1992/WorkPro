const express = require("express");

const app = express();

const { routerList } = require("../api/list");
const { routerCard } = require("../api/card");
const { routerAppleWallet } = require("../api/appleWallet");
const { routerConfigurator } = require("../api/configurator");
const { routerDic } = require("../api/dic");
const { routerWizard } = require("../api/wizard");
const { routerUser } = require("../api/user");
const { routerRefresh } = require("../api/refresh");
const { routerDadata } = require("../api/dadata");
const { routerMenu } = require("../api/menu");
const { routerHealthcheck } = require("../api/healthcheck");
const { routerVersion } = require("../api/version");

app.use(routerList);
app.use(routerCard);
app.use(routerAppleWallet);
app.use(routerConfigurator);
app.use(routerDic);
app.use(routerWizard);
app.use(routerUser);
app.use(routerRefresh);
app.use(routerDadata);
app.use(routerMenu);
app.use(routerHealthcheck);
app.use(routerVersion, (req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

module.exports = {
  path: "/api",
  handler: app,
};
