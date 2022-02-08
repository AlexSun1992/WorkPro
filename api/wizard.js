/* eslint-disable */
import listConverter from "../converters/list";
import consts from "../api/urls";

import { mobile2Service } from "./../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/wizard/:idModule/:idItem/:idCard", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else {
      if (req.cookies) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.cookies["auth._token.local"];
      }
    }
    const ID = parseInt(req.params.idCard);
    const list = await mobile2ServiceInstance.get(
      `${consts.DATA}/${req.params.idModule}/${req.params.idItem}?json={"pID":${ID}}`
    );
    const list_data = listConverter.list(list.data);
    let card = null;
    let result = { data: null, meta: null };
    let rel;
    if (list_data.items.length !== 0) {
      rel = list_data.items[0].REL;
    }
    card = await mobile2ServiceInstance.get(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${ID}` +
        (rel ? `?REL=${rel}` : "")
    );
    if (card) {
      result = {
        data: card.data[0]._data[0],
        meta: card.data[0]._meta,
      };
    }
    res.send(result);
  } catch (err) {
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
