import selectConverter from "../converters/select";
import consts from "./urls";

import { mobile2Service } from "../services/mobile2.services";

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

router.get("/dic/:moduleId/:itemId/:name", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else if (req.cookies) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
    }
    mobile2ServiceInstance({
      url: `${consts.DIC}/${req.params.moduleId}/${req.params.itemId}/${req.params.name}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(selectConverter.select(resp.data));
      })
      .catch((err) => {
        if (err?.response?.data.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res
            .status(err?.response?.data.STATUS || 500)
            .send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});
router.get("/dicwf/:fieldId/:valueId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req?.cookies["auth._token.local"];
      }
    }
    mobile2ServiceInstance({
      url: `${consts.DICWF}/${req.params.fieldId}/${req.params.valueId}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(selectConverter.select(resp.data));
      })
      .catch((err) => {
        if (err?.response?.data.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res
            .status(err?.response?.data.STATUS || 500)
            .send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = {
  routerDic: router,
};
