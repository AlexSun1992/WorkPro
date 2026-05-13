/* eslint-disable */
import listConverter from "../converters/list";
import menuConverter from "../converters/menu";
import consts from "./urls";

import { mobile2Service } from "../services/mobile2.services";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();

const bodyParser = require("body-parser");
const requestIp = require("request-ip");
router.use(
  bodyParser.json({
    limit: "50mb",
  })
);
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
router.use(express.json({ limit: "50mb" }));
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

router.use(cookieParser());

router.get("/list/:idModule/:idItem/:filters", async (req, res, next) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    let URL_ADDRESS;
    const idCard = /^\d+$/.test(req.params.filters) ? req.params.filters : 0;
    let settings = null;
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    if (req?.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
      }
      URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}/0/${idCard}?json=${encodeURIComponent(
        req.params.filters
      )}`;
      settings = await mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idItem}`);
    } else {
      URL_ADDRESS = `${consts.FREEDATA}/${req.params.idModule}/${req.params.idItem}/0/${idCard || 0}`;
    }
    const list = await mobile2ServiceInstance.get(URL_ADDRESS);
    res.send({
      ...listConverter.list(list.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS == 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

router.post("/list/:idModule/:idItem/:idCard?", async (req, res, next) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    let URL_ADDRESS;
    let settings = null;
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    if (req?.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
      }
      const URLFilters = encodeURIComponent(JSON.stringify(req.body ?? {}));
      URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}/0/${
        req.params.idCard || 0
      }?json=${URLFilters}`;
      settings = await mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idItem}`);
    } else {
      URL_ADDRESS = `${consts.FREEDATA}/${req.params.idModule}/${req.params.idItem}/0/${req.params.idCard || 0}`;
    }
    const list = await mobile2ServiceInstance.get(URL_ADDRESS);
    res.send({
      ...listConverter.list(list.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS == 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

router.get("/onetomanylist/:idItem/:id/:rel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else if (req.cookies) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.cookies["auth._token.local"];
    }
    mobile2ServiceInstance({
      url: `${consts.ONETOMANYDATA}/${req.params.idItem}/${req.params.id}?rel=${req.params.rel}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(listConverter.list(resp.data));
      })
      .catch((err) => {
        if (err.response.data.STATUS === 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

router.get("/wizardlist/:idModule/:idWizard/:idItem", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else if (req?.cookies["auth._token.local"]) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
    }
    const settings = await mobile2ServiceInstance.get(
      `${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idWizard}`
    );
    const wizardList = await mobile2ServiceInstance.get(
      `${consts.DATA}/${req.params.idModule}/${req.params.idWizard}/0/${req.params.idItem}?json={}`
    );
    res.send({
      ...listConverter.list(wizardList.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS == 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

module.exports = {
  routerList: router,
};
