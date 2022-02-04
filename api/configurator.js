import converter from "../converters/menu";
import consts from "../api/urls";

import { axios } from "./api";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

const modules = {};
const menu = {};

router.get("/module", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        axios.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    axios.defaults.headers.common.Authorization = null;
    if (req?.headers?.authorization) {
      axios.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req?.cookies["auth._token.local"]) {
        axios.defaults.headers.common.Authorization =
          req?.cookies["auth._token.local"];
      }
    }
    modules.getItems = () => {
      return new Promise((resolve, reject) => {
        axios({ url: `${consts.MODULE}`, method: "GET" })
          .then((resp) => {
            const modules = converter.modules(resp.data);
            resolve(modules);
          })
          .catch((err) => {
            res.status(err.response.data.STATUS).send(err.response.data);
          });
      });
    };
    menu.getItems = (modules) => {
      return new Promise((resolve, reject) => {
        axios
          .all(modules.map((l) => axios.get(`${consts.CLIENTMENU}/${l.id}`)))
          .then(
            axios.spread(function (...res) {
              resolve(res);
            })
          )
          .catch((err) => {
            res.status(err.response.data.STATUS).send(err.response.data);
          });
      });
    };
    modules.getItems().then((modules) => {
      menu
        .getItems(modules)
        .then((menu) => {
          converter.sidebar(modules, menu);
          res.send(modules);
        })
        .catch((err) => {
          res.status(err.response.data.STATUS).send(err.response.data);
        });
    });
  } catch (e) {
    res.send(e);
  }
});

module.exports = {
  routerConfigurator: router,
};
