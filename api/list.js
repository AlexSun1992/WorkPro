/* eslint-disable */
import listConverter from "../converters/list";
import formConverter from "../converters/form";
import consts from "../api/urls";
import { axios } from "./api";

const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const router = express.Router();

const bodyParser = require("body-parser");
router.use(
  bodyParser.json({
    limit: "50mb",
  })
);
router.use(
  bodyParser.urlencoded({
    limit: "50mb",
    parameterLimit: 100000,
    extended: true,
  })
);
router.use(express.json({ limit: "50mb" }));

router.use(cookieParser());

router.get("/list/:idModule/:idItem/:filters", (req, res, next) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        axios.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    let URL_ADDRESS;
    const filters = listConverter.getFilterParams(
      formConverter.save(JSON.parse(req.params.filters))
    );
    axios.defaults.headers.common.Authorization = null;
    if (req?.query.zone !== "free") {
      if (req?.headers?.authorization) {
        axios.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          axios.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
        }
      }
      URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${
        req.params.idItem
      }?json=${encodeURIComponent(req.params.filters)}`;
    } else {
      URL_ADDRESS = `${consts.FREEDATA}/${req.params.idModule}/${req.params.idItem}/0/0`;
    }
    axios({
      url: URL_ADDRESS,
      method: "GET",
    })
      .then((resp) => {
        res.send(listConverter.list(resp.data));
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.data.STATUS == 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res
            .status(err?.response?.data.STATUS || 500)
            .send(err?.response?.data || err);
        }
      });
  } catch (e) {
    console.log(e);
    res.send(e);
  }
});

router.get("/onetomanylist/:idItem/:id/:rel", (req, res) => {
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
      url: `${consts.ONETOMANYDATA}/${req.params.idItem}/${req.params.id}?rel=${req.params.rel}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(listConverter.list(resp.data));
      })
      .catch((err) => {
        if (err.response.data.STATUS === 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err.response.data.STATUS).send(err.response.data);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

router.get("/wizardlist/:idModule/:idWizard/:idItem", (req, res) => {
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
      url: `${consts.DATA}/${req.params.idModule}/${req.params.idWizard}/0/${req.params.idItem}?json={}`,
      method: "GET",
    })
      .then((resp) => {
        res.send(listConverter.list(resp.data));
      })
      .catch((err) => {
        res.status(err.response.data.STATUS).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = {
  routerList: router,
};
