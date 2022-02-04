export const axios = require("axios");
const express = require("express");
const app = express();

const { routerList } = require("./list");
const { routerCard } = require("./card");
const { routerConfigurator } = require("./configurator");
const { routerDic } = require("./dic");
const { routerWizard } = require("./wizard");
const { routerUser } = require("./user");
const { routerRefresh } = require("./refresh");
const { routerDadata } = require("./dadata");
const { routerMenu } = require("./menu");

axios.defaults.headers.common["X-Application"] = "VueJS";

app.use(routerList);
app.use(routerCard);
app.use(routerConfigurator);
app.use(routerDic);
app.use(routerWizard);
app.use(routerUser);
app.use(routerRefresh);
app.use(routerDadata);
app.use(routerMenu);

module.exports = {
  path: "/api",
  handler: app,
};
