/* eslint-disable */
import formConverter from "../converters/dataform";
import menuConverter from "../converters/menu";
import filterConverter from "../converters/filter";
import freeMethodsConverter from "../converters/forfreemethods";
import consts from "./urls";
import fs from "fs";
import { mobile2Service } from "../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

const requestIp = require("request-ip");

const IP = require("ip");

const { createLogger, format, transports } = require("winston");
const { combine, timestamp } = format;

const logger = createLogger({
  format: combine(timestamp(), format.splat(), format.json()),
  transports: [new transports.Console()],
});

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

router.get("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    const ipAddress = requestIp.getClientIp(req);
    let mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
        }
      }
    }
    const URL_ADDRESSS = encodeURI(
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
        req.params.idItem
      }/${req.params.id}${req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""}`
    );
    mobile2ServiceInstance({
      url: URL_ADDRESSS,
      method: "GET",
    })
      .then(async (resp) => {
        const data = await formConverter.form(
          resp.data,
          {
            ...req.query,
            ...req.params,
          },
          mobile2ServiceInstance
        );
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data?.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});
router.get("/card/:idModule/:idItem", (req, res) => {
  try {
    let mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
        }
      }
    }
    const URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}?json=${encodeURIComponent(
      JSON.stringify(req.query)
    )}`;
    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
    })
      .then(async (resp) => {
        const data = await formConverter.form(
          resp.data,
          {
            ...req.query,
            ...req.params,
          },
          mobile2ServiceInstance
        );
        res.send(data);
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data?.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data?.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});
router.get("/card/:idModule/:idItem/:idWizard/:idCard/:idList", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
      }
    }
    console.log(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.idCard}/${
        req.params.idList ? req.params.idList : req.params.idWizard
      }`
    );
    const url = encodeURI(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.idCard}/${
        req.params.idList ? req.params.idList : req.params.idWizard
      }`
    );
    mobile2ServiceInstance({
      url: url,
      method: "GET",
    })
      .then(async (resp) => {
        const data = await formConverter.form(
          resp.data,
          {
            ...req.query,
            ...req.params,
          },
          mobile2ServiceInstance
        );
        res.send(data);
      })
      .catch((err) => {
        console.error(err);
        if (err?.response?.data.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});
router.get("/osago", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance({
      url: encodeURI(`${consts.FREEDATACARD}/55/738/0/0`),
      method: "GET",
    })
      .then(async (resp) => {
        let data = freeMethodsConverter.osago(await formConverter.form(resp.data, { ...req.query, ...req.params }));
        const menu = await mobile2ServiceInstance.get(`${consts.FREEMENU}/55/738`);
        data.settings = menuConverter.menuObject(menu.data[0]._data[0]);
        res.send(data);
      })
      .catch((err) => {
        res.status(err.response.data ? err.response.data.STATUS : 500).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});

router.get("/card/js/:idModule/:idItem", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    const URL_ADDRESS = encodeURI(`/lk/free/v2/vuetemplate/${req.params.idItem}?time=${new Date().getTime()}`);
    const { idItem } = req.params;

    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
    })
      .then(async (resp) => {
        res.set("Content-Type", "text/javascript");
        res.send(resp.data[0].SVJMETHOD || "function eventHandler(data, item) {\n" + "  return null\n" + "}");
      })
      .catch((err) => {
        console.error(new Date(), `Ошибка загрузки скрипта ${URL_ADDRESS}: ${err.response?.status}, ${err}`);
        if (err?.response?.data.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

router.post("/card/actionexec/:rowId/:actionId/:relId?/:relActionId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["X-Application"] = req.cookies.isWebview ? "isWebview" : "VueJS";
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req.cookies && req.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.cookies["auth._token.local"];
      }
    }
    const body = req.body;
    const url = `${req.query.zone === "free" ? consts.FREEACTIONEXEC : consts.ACTIONEXEC}/${req.params.rowId}/${
      req.params.actionId
    }${req.params.relId !== "undefined" ? `?rel=${req.params.relId}&` : "?"}${
      req.params.relActionId !== "undefined" ? `relaction=${req.params.relActionId}` : ""
    }`;

    logger.log("info", `HTTP GET ${url}`, {
      body: body,
      userid: req?.cookies["auth.user_id"],
    });

    mobile2ServiceInstance
      .post(url, body)
      .then((resp) => {
        res.send(resp.data[0]);
      })
      .catch((err) => {
        logger.log("error", `HTTP GET ${url}`, {
          response: err?.response?.data || err,
          userid: req?.cookies["auth.user_id"],
        });
        res.status(err?.response?.data.STATUS || 500).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});

router.post("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    if (req.query.zone !== "free") {
      if (req.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (req.cookies && Boolean(mobile2ServiceInstance?.defaults?.headers?.common?.Authorization)) {
          mobile2ServiceInstance.defaults.headers.common.Authorization = req.cookies["auth._token.local"];
        }
      }
    }
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;

    const typeReq = req.params.id === 0 ? "post" : "put";
    const body = req.body;
    const url = `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
      req.params.idItem
    }/${req.params.id}${req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""}`;
    logger.log("info", `HTTP GET ${url}`, {
      body: body,
      userid: req?.cookies["auth.user_id"],
    });

    mobile2ServiceInstance[typeReq](url, body)
      .then((resp) => {
        res.send(resp.data[0]);
      })
      .catch((err) => {
        logger.log("error", `HTTP GET ${url}`, {
          response: err?.response?.data || err,
          userid: req?.cookies["auth.user_id"],
        });
        if (err?.response?.data) {
          res.status(err?.response?.data.STATUS || 500).send(err.response.data);
        } else {
          res.status(500).send(err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

router.get("/action/:moduleId/:actionId/:cardId", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
      }
    }
    const params = await mobile2ServiceInstance.get(
      `${req.query.zone === "free" ? consts.FREEACTIONPARAM : consts.ACTIONPARAM}/${req.params.moduleId}/${
        req.params.actionId
      }/${req.params.cardId}`
    );
    res.send(filterConverter.filter(params.data[0]._data));
  } catch (err) {
    if (err?.response?.data) {
      res.status(err?.response?.data.STATUS || 500).send(err.response.data);
    } else {
      res.status(500).send(err);
    }
  }
});
module.exports = {
  routerCard: router,
};
