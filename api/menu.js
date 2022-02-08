import consts from "../api/urls";

import { mobile2Service } from "./../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/menu/:idModule/?:idItem", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance = mobile2Service("https://mobiletest.reso.ru");
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
        }
      }
    }
    let URL_ADDRESSS;
    if (req.query.zone === "free") {
      URL_ADDRESSS = encodeURI(
        `${consts.CLIENTFREEMENU}/${req.params.idModule}/${req.params.idItem}`
      );
    } else {
      URL_ADDRESSS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}`);
    }
    mobile2ServiceInstance({
      url: URL_ADDRESSS,
      method: "GET",
    })
      .then(async (resp) => {
        res.send(resp.data);
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
  routerMenu: router,
};
