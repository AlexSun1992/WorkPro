/* eslint-disable */
import listConverter from "../converters/list";
import formConverter from "../converters/form";
import consts from "../api/urls";

const express = require("express");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.post("/token_refresh", async (req, res) => {
  try {
    if (req.cookies) {
      axios.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = "https://mobile2.reso.ru";
    }
    const { data } = await axios.post(`${consts.REFRESH_TOKEN}`, req.body);
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
  path: "/api",
  handler: app,
};
