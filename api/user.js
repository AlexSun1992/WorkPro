/* eslint-disable */
import consts from "../api/urls";

import { axios } from "./api";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/userinfo", async (req, res) => {
  try {
    if (req.cookies) {
      axios.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = "https://mobile2.reso.ru";
    }
    const { data } = await axios.get(`${consts.USERPROFILE}`);
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
  routerUser: router,
};
