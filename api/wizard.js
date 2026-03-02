import listConverter from "../converters/list";
// eslint-disable-next-line import/extensions
import consts from "./urls.mjs";
// eslint-disable-next-line import/extensions
import { mobile2Service } from "../services/mobile2.services.mjs";

const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
const router = express.Router();

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());
const requestIp = require("request-ip");

router.get("/wizard/:idModule/:idItem/:idCard", async (req, res) => {
  try {
    const ipAddress = requestIp.getClientIp(req);
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    mobile2ServiceInstance.defaults.headers.common.Cookie = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
        }
    }
    let card = null;
    let result = { data: null, meta: null };
    let rel;
    const ID = parseInt(req.params.idCard);
    if (ID > 0) {
      console.log(
        `${req.query.zone === "free" ? consts.FREEDATA : consts.DATA}/${req.params.idModule}/${
          req.params.idItem
        }?json={"pID":${ID}}`
      );
      const list = await mobile2ServiceInstance.get(
        `${req.query.zone === "free" ? consts.FREEDATA : consts.DATA}/${req.params.idModule}/${req.params.idItem}${
          req.query.zone === "free" ? "/0/0" : ""
        }?json={"pID":${ID}}`
      );
      const list_data = listConverter.list(list.data);
      const itemWithRel = list_data.items.find((item) => item.ID === ID);
      if (!itemWithRel) {
        throw new Error(`В списке IDITEM=${req.params.idItem} не найден REL с ID=${ID}`);
      }
      rel = itemWithRel.REL;
    }
    console.log(
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
        req.params.idItem
      }/${ID}`
    );
    card = await mobile2ServiceInstance.get(
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${req.params.idModule}/${
        req.params.idItem
      }/${ID}${  rel ? `?REL=${rel}` : ""}`
    );
    if (card) {
      result = {
        data: card.data[0]._data[0],
        meta: card.data[0]._meta,
      };
    }
    res.send(result);
  } catch (err) {
    if (!err.response) {
      return res.status(400).send({
        MESSAGE: err.message,
        STATUS: 400,
      });
    }
    if (err.response.data.STATUS == 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err.response.data.STATUS).send(err.response.data);
    }
  }
});

module.exports = {
  routerWizard: router,
};
