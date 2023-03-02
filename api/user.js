/* eslint-disable */
import consts from "../api/urls";

import { mobile2Service } from "./../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

router.get("/userinfo", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.cookies) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
    }
    const { data } = await mobile2ServiceInstance.get(`${consts.USERPROFILE}`);
    res.send(data);
  } catch (err) {
    if (err?.response?.status === 401) {
      res.status(200).send(err.response.data);
    } else {
      res.status(500).send(err);
    }
  }
});

module.exports = {
  routerUser: router,
};
