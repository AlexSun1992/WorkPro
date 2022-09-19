import axios from "axios";
import converter from "../converters/menu";
import consts from "./urls";
import { mobile2Service } from "../services/mobile2.services";
import selectConverter from "../converters/select";
import listConverter from "../converters/list";
import menuConverter from "../converters/menu";

const cookieParser = require("cookie-parser");
const express = require("express");

const router = express.Router();
router.use(express.json());
router.use(cookieParser());

const modules = {};
const menu = {};

router.get("/module", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.baseURL =
      process.env.MOBILE2_URL ?? "https://mobile2.reso.ru";
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else if (req?.cookies["auth._token.local"]) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req?.cookies["auth._token.local"];
    }
    modules.getItems = () => {
      return new Promise((resolve, reject) => {
        mobile2ServiceInstance({ url: `${consts.MODULE}`, method: "GET" })
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
        Promise.all(
          modules.map((l) =>
            mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${l.id}`)
          )
        )
          .then(
            axios.spread(function (...res) {
              resolve(res);
            })
          )
          .catch((err) => {
            res.status(err?.response?.data?.STATUS).send(err?.response?.data);
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
          console.log(err);
          res.status(err.response.data.STATUS).send(err.response.data);
        });
    });
  } catch (e) {
    res.send(e);
  }
});
router.get("/module/:moduleId/:itemId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else if (req.cookies) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
    }
    mobile2ServiceInstance({
      url: `${consts.CLIENTMENU}/${req.params.moduleId}/${req.params.itemId}`,
      method: "GET",
    })
      .then((resp) => {
        const { data } = resp;
        res.send({
          settings: data[0]._data[0],
          subSettings: menuConverter.menuObject(data[0]._data[0]),
        });
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
  routerConfigurator: router,
};
