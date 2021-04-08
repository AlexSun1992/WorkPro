/* eslint-disable */
import formConverter from "../converters/form";
import menuConverter from "../converters/menu";
import filterConverter from "../converters/filter";
import freeMethodsConverter from "../converters/forfreemethods";
import consts from "./urls";

const express = require("express");

const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

const modules = {};
const menu = {};

app.get("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
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
      url: encodeURI(
        `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${
          req.params.id
        }${req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""}`
      ),
      method: "GET",
    })
      .then(async (resp) => {
        // res.send(formConverter.form(resp.data, req.params.idItem))
        res.send(await formConverter.form(resp.data, req.params.idItem));
      })
      .catch((err) => {
        res.status(err.response.data.STATUS).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});
app.post(
  "/card/actionexec/:rowId/:actionId/:relId?/:relActionId",
  (req, res) => {
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
      const body = formConverter.save(req.body);
      const url = `${consts.ACTIONEXEC}/${req.params.rowId}/${
        req.params.actionId
      }${req.params.relId !== "undefined" ? `?rel=${req.params.relId}&` : "?"}${
        req.params.relActionId !== "undefined"
          ? `relaction=${req.params.relActionId}`
          : ""
      }`;
      axios
        .post(url, body)
        .then((resp) => {
          res.send(resp.data[0]);
        })
        .catch((err) => {
          res.status(err.response.data.STATUS).send(err.response.data);
        });
    } catch (e) {
      res.send(e);
    }
  }
);

module.exports = {
  path: "/api",
  handler: app,
};
