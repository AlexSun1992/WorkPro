import axios from "axios";
import converter from "../converters/menu";
import consts from "./urls";
import { mobile2Service } from "../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");

const router = express.Router();
const requestIp = require("request-ip");

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

const modules = {};
const menu = {};

router.get("/module", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.baseURL =
      process.env.MOBILE2_URL ?? "https://lk.reso.ru";
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer =
        req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else if (req?.cookies["auth._token.local"]) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req?.cookies["auth._token.local"];
    }
    modules.getItems = () =>
      new Promise((resolve, reject) => {
        mobile2ServiceInstance({ url: `${consts.MODULE}`, method: "GET" })
          .then((resp) => {
            resolve(converter.modules(resp.data));
          })
          .catch((err) => {
            console.log(err);
            if (err?.response?.data?.STATUS == 401) {
              res.status(err.response.data.STATUS).send(err.response.data);
            } else {
              res
                .status(err?.response?.data?.STATUS || 500)
                .send(err?.response?.data || err);
            }
          });
      });
    menu.getItems = (modules) =>
      new Promise((resolve, reject) => {
        Promise.all(
          modules.map((l) =>
            mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${l.id}`)
          )
        )
          .then(
            axios.spread((...res) => {
              resolve(res);
            })
          )
          .catch((err) => {
            if (err?.response?.data) {
              res
                .status(err?.response?.data.STATUS || 500)
                .send(err.response.data);
            } else {
              res.status(500).send(err);
            }
          });
      });
    modules.getItems().then((modules) => {
      menu
        .getItems(modules)
        .then((menu) => {
          converter.sidebar(modules, menu);
          res.send(modules);
        })
        .catch((err) => {
          if (err?.response?.data) {
            res
              .status(err?.response?.data.STATUS || 500)
              .send(err.response.data);
          } else {
            res.status(500).send(err);
          }
        });
    });
  } catch (e) {
    res.send(e);
  }
});
router.get("/module/:moduleId/:itemId", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const ipAddress = requestIp.getClientIp(req);
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer =
        req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] =
      ipAddress || "";
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] =
      req.headers["user-agent"];
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req?.cookies["auth._token.local"];
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Cookie = req.headers?.cookie
      ? req.headers.cookie
      : null;
    mobile2ServiceInstance({
      url: `${
        req.query.zone === "free" ? consts.CLIENTFREEMENU : consts.CLIENTMENU
      }/${req.params.moduleId}/${req.params.itemId}`,
      method: "GET",
    })
      .then((resp) => {
        const { data } = resp;
        res.send({
          settings: req.query.zone === "free" ? data[0]._data[0] : data[0],
          subSettings: converter.menuObject(
            req.query.zone === "free" ? data[0]._data[0] : data[0]
          ),
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
