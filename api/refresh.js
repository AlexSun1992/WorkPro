/* eslint-disable */
import consts from "./urls.mjs";

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

router.post("/token_refresh", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.cookies) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
    }
    const { data } = await mobile2ServiceInstance.post(
      `${consts.REFRESH_TOKEN}`,
      req.body
    );
    res.send(data);
  } catch (err) {
    if (err?.response.status === 401) {
      res.status(200).send(err.response.data);
    } else {
      res.status(500).send(err);
    }
  }
});

module.exports = {
  routerRefresh: router,
};
