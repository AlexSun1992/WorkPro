import selectConverter from "../converters/select";
import consts from "./urls";

import { mobile2Service } from "../services/mobile2.services";
import setCommonHeaders from "./setHeaders";

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

router.get("/dic/:moduleId/:itemId/:name/:cardId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    mobile2ServiceInstance({
      url: `${consts.DIC}/${req.params.moduleId}/${req.params.itemId}/${req.params.name}/0/null/${req.params.cardId}`,
      params: req.query,
      method: "GET",
      headers,
    })
      .then((resp) => {
        res.send(selectConverter.select(resp.data));
      })
      .catch((err) => {
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
router.get("/dicwf/:fieldId/:valueId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    mobile2ServiceInstance({
      url: `${req.query.zone === "free" ? consts.FREEDICWF : consts.DICWF}/${req.params.fieldId}/${req.params.valueId}`,
      params: req.query,
      method: "GET",
      headers,
    })
      .then((resp) => {
        res.send(selectConverter.select(resp.data));
      })
      .catch((err) => {
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

module.exports = {
  routerDic: router,
};
