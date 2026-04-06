import converter from "../converters/menu";
import consts from "./urls";
import { mobile2Service } from "../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");

const router = express.Router();
const requestIp = require("request-ip");

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

const getModules = async (mobile2ServiceInstance) => {
  const resp = await mobile2ServiceInstance({
    url: `${consts.MODULE}`,
    method: "GET",
  });

  return converter.modules(resp.data);
};

const getMenu = async (mobile2ServiceInstance, modules) => {
  const responses = await Promise.all(modules.map((l) => mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${l.id}`)));

  return responses;
};

router.get("/module", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.baseURL = process.env.MOBILE2_URL ?? "https://lk.reso.ru";

    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }

    mobile2ServiceInstance.defaults.headers.common.Authorization = null;

    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else if (req?.cookies["auth._token.local"]) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.cookies["auth._token.local"];
    }

    const modulesData = await getModules(mobile2ServiceInstance);
    const menuData = await getMenu(mobile2ServiceInstance, modulesData);
    converter.sidebar(modulesData, menuData);
    return res.send(modulesData);
  } catch (err) {
    if (res.headersSent) return;
    if (err?.response?.data) {
      return res.status(err.response.data.STATUS || 500).send(err.response.data);
    }

    return res.status(500).send(err);
  }
});

router.get("/module/:moduleId/:itemId", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);

    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }

    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || "";
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];

    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.cookies["auth._token.local"];
      }
    }

    mobile2ServiceInstance.defaults.headers.common.Cookie = req.headers?.cookie || null;
    const resp = await mobile2ServiceInstance({
      url: `${req.query.zone === "free" ? consts.CLIENTFREEMENU : consts.CLIENTMENU}/${req.params.moduleId}/${
        req.params.itemId
      }`,
      method: "GET",
    });

    const { data } = resp;

    return res.send({
      settings: req.query.zone === "free" ? data[0]._data[0] : data[0],
      subSettings: converter.menuObject(req.query.zone === "free" ? data[0]._data[0] : data[0]),
    });
  } catch (err) {
    if (res.headersSent) return;
    if (err?.response?.data?.STATUS == 401) {
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
