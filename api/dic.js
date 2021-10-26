import selectConverter from "../converters/select";
import consts from "../api/urls";

const express = require("express");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const modules = {};
const menu = {};

app.get("/dic/:moduleId/:itemId/:name", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    if (req.headers.authorization) {
      axios.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req.cookies) {
        axios.defaults.headers.common.Authorization =
          req.cookies["auth._token.local"];
      }
    }
    axios({
      url: `${consts.DIC}/${req.params.moduleId}/${req.params.itemId}/${req.params.name}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(selectConverter.select(resp.data));
      })
      .catch((err) => {
        res.status(err.response.data.STATUS).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});
app.get("/dicwf/:fieldId/:valueId", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    axios.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        axios.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          axios.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
        }
      }
    }
    axios({
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
  path: "/api",
  handler: app,
};
