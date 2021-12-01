import consts from "../api/urls";

const express = require("express");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.get("/menu/:idModule/?:idItem", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        axios.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
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
    let URL_ADDRESSS;
    if (req.query.zone === "free") {
      URL_ADDRESSS = encodeURI(
        `${consts.CLIENTFREEMENU}/${req.params.idModule}/${req.params.idItem}`
      );
    } else {
      URL_ADDRESSS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}`);
    }
    axios({
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
  path: "/api",
  handler: app,
};
