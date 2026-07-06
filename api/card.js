/* eslint-disable */
import formConverter from "../converters/dataform";
import menuConverter from "../converters/menu";
import filterConverter from "../converters/filter";
import freeMethodsConverter from "../converters/forfreemethods";
import consts from "./urls";
import fs from "fs";
import { mobile2Service } from "../services/mobile2.services";
import segmentCookiesMiddleware from "./setCookieMiddleware";
import setCommonHeaders from "./setHeaders";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

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
router.use(segmentCookiesMiddleware);

router.get("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const URL_ADDRESSS = encodeURI(
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
        req.params.idItem
      }/${req.params.id}${req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""}`
    );
    mobile2ServiceInstance({
      url: URL_ADDRESSS,
      method: "GET",
      headers,
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
        if (err?.response?.data?.STATUS === 401) {
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
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}?json=${encodeURIComponent(
      JSON.stringify(req.query)
    )}`;
    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
      headers,
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
        if (err?.response?.data?.STATUS === 401) {
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

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const url = encodeURI(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.idCard}/${
        req.params.idList ? req.params.idList : req.params.idWizard
      }`
    );
    mobile2ServiceInstance({
      url: url,
      method: "GET",
      headers,
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
        if (err?.response?.data.STATUS === 401) {
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
        const data = freeMethodsConverter.osago(await formConverter.form(resp.data, { ...req.query, ...req.params }));
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

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const URL_ADDRESS = encodeURI(`/lk/free/v2/vuetemplate/${req.params.idItem}?time=${new Date().getTime()}`);

    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
      headers,
    })
      .then(async (resp) => {
        res.set("Content-Type", "text/javascript");
        res.send(resp.data[0].SVJMETHOD || "function eventHandler(data, item) {\n" + "  return null\n" + "}");
      })
      .catch((err) => {
        console.error(new Date(), `Ошибка загрузки скрипта ${URL_ADDRESS}: ${err.response?.status}, ${err}`);
        if (err?.response?.data.STATUS === 401) {
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

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

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
      .post(url, body, { headers })
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

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const typeReq = req.params.id === 0 ? "post" : "put";
    const body = req.body;
    const url = `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
      req.params.idItem
    }/${req.params.id}${req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""}`;
    logger.log("info", `HTTP GET ${url}`, {
      body: body,
      userid: req?.cookies["auth.user_id"],
    });

    mobile2ServiceInstance[typeReq](url, body, { headers })
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

    const headers = setCommonHeaders(req);
    Object.assign(mobile2ServiceInstance.defaults.headers.common, headers);

    const params = await mobile2ServiceInstance.get(
      `${req.query.zone === "free" ? consts.FREEACTIONPARAM : consts.ACTIONPARAM}/${req.params.moduleId}/${
        req.params.actionId
      }/${req.params.cardId}`,
      { headers }
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
