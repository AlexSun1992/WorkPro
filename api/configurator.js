import converter from "../converters/menu";
import consts from "./urls";
import { mobile2Service } from "../services/mobile2.services";
import setCommonHeaders from "./setHeaders";

const cookieParser = require("cookie-parser");
const express = require("express");

const router = express.Router();

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

const getModules = async (mobile2ServiceInstance, headers) => {
  const resp = await mobile2ServiceInstance({
    url: `${consts.MODULE}`,
    method: "GET",
    headers,
  });

  return converter.modules(resp.data);
};

const getMenu = async (mobile2ServiceInstance, modules, headers) =>
  Promise.all(modules.map((l) => mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${l.id}`, { headers })));

router.get("/module", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.baseURL = process.env.MOBILE2_URL ?? "https://lk.reso.ru";

    const headers = setCommonHeaders(req);

    const modulesData = await getModules(mobile2ServiceInstance, headers);
    const menuData = await getMenu(mobile2ServiceInstance, modulesData, headers);
    converter.sidebar(modulesData, menuData);
    return res.send(modulesData);
  } catch (err) {
    if (res.headersSent) {
      return;
    }
    if (err?.response?.data) {
      return res.status(err.response.data.STATUS || 500).send(err.response.data);
    }

    return res.status(500).send(err);
  }
});

router.get("/module/:moduleId/:itemId", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    const resp = await mobile2ServiceInstance({
      url: `${req.query.zone === "free" ? consts.CLIENTFREEMENU : consts.CLIENTMENU}/${req.params.moduleId}/${
        req.params.itemId
      }`,
      method: "GET",
      headers,
    });

    const { data } = resp;

    return res.send({
      settings: req.query.zone === "free" ? data[0]._data[0] : data[0],
      subSettings: converter.menuObject(req.query.zone === "free" ? data[0]._data[0] : data[0]),
    });
  } catch (err) {
    if (res.headersSent) {
      return;
    }
    if (err?.response?.data?.STATUS === 401) {
      return res.status(err.response.data.STATUS).send(err.response.data);
    }
    if (err?.response?.data) {
      return res.status(err.response.data.STATUS || 500).send(err.response.data);
    }

    return res.status(500).send(err);
  }
});

module.exports = {
  routerConfigurator: router,
};
