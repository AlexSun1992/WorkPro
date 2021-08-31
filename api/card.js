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
    if (req.query.zone !== "free") {
      if (Boolean(req?.headers?.authorization)) {
        if (Boolean(axios?.defaults?.headers?.common?.Authorization)) {
          axios.defaults.headers.common.Authorization =
            req.headers.authorization;
        }
      } else {
        if (
          req.cookies &&
          Boolean(axios?.defaults?.headers?.common?.Authorization)
        ) {
          axios.defaults.headers.common.Authorization =
            req.cookies["auth._token.local"];
        }
      }
    }
    const URL_ADDRESSS = encodeURI(
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${
        req.params.idModule
      }/${req.params.idItem}/${req.params.id}${
        req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""
      }`
    );
    axios({
      url: URL_ADDRESSS,
      method: "GET",
    })
      .then(async (resp) => {
        res.send(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
      })
      .catch((err) => {
        if (err?.response?.data) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(500).send(err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});
app.get("/card/:idModule/:idItem/:idWizard/:idCard/:idRel", (req, res) => {
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
    const url = encodeURI(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.idCard}/${req.params.idWizard}`
    );
    axios({
      url: url,
      method: "GET",
    })
      .then(async (resp) => {
        // res.send(formConverter.form(resp.data, req.params.idItem))
        res.send(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
      })
      .catch((err) => {
        res.status(err.response.data.STATUS).send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});
app.get("/osago", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    axios({
      url: encodeURI(`${consts.FREEDATACARD}/55/738/0/0`),
      method: "GET",
    })
      .then(async (resp) => {
        let data = freeMethodsConverter.osago(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
        const menu = await axios.get(`${consts.FREEMENU}/55/738`);
        data.settings = menuConverter.menuObject(menu.data[0]._data[0]);
        res.send(data);
      })
      .catch((err) => {
        res
          .status(err.response.data ? err.response.data.STATUS : 500)
          .send(err.response.data);
      });
  } catch (e) {
    res.send(e);
  }
});

app.get("/card/js/:idModule/:idItem", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    let URL_ADDRESS;
    if (req.query.zone !== "free") {
      if (req.headers?.authorization) {
        axios.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (
          req.cookies &&
          Boolean(axios?.defaults?.headers?.common?.Authorization)
        ) {
          axios.defaults.headers.common.Authorization =
            req.cookies["auth._token.local"];
        }
      }
      URL_ADDRESS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}`);
    } else {
      URL_ADDRESS = encodeURI(
        `${consts.CLIENTFREEMENU}/${req.params.idModule}/${req.params.idItem}`
      );
    }
    axios({
      url: URL_ADDRESS,
      method: "GET",
    })
      .then(async (resp) => {
        res.set("Content-Type", "text/javascript");
        res.send(
          resp.data[0]._data.find(
            (item) => item.IDITEM === parseInt(req.params.idItem)
          ).SVJMETHOD ||
            "function eventHandler(data, item) {\n" + "  return null\n" + "}"
        );
      })
      .catch((err) => {
        if (err?.response?.data) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(500).send(err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

app.get("/file/:idReport/:idCard", (req, res) => {
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
      url: `${consts.REPORT}?idreport=${req.params.idReport}&id=${req.params.idCard}`,
      method: "GET",
      responseType: "arraybuffer",
    })
      .then(async (resp) => {
        res.contentType("application/pdf");
        res.send(resp.data);
      })
      .catch((err) => {
        res.contentType("application/json");
        res.status(500).send(err.response.data);
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

app.post("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    axios.defaults.baseURL = "https://mobile2.reso.ru";
    if (req.query.zone !== "free") {
      if (req.headers?.authorization) {
        axios.defaults.headers.common.Authorization = req.headers.authorization;
      } else {
        if (
          req.cookies &&
          Boolean(axios?.defaults?.headers?.common?.Authorization)
        ) {
          axios.defaults.headers.common.Authorization =
            req.cookies["auth._token.local"];
        }
      }
    }
    const typeReq = req.params.id === 0 ? "post" : "put";
    console.log(JSON.stringify(formConverter.save(req.body)));
    axios[typeReq](
      `${req.query.zone === "free" ? consts.FREEDATACARD : consts.DATACARD}/${
        req.params.idModule
      }/${req.params.idItem}/${req.params.id}${
        req.params.idRel !== "undefined" ? `?rel=${req.params.idRel}` : ""
      }`,
      formConverter.save(req.body)
    )
      .then((resp) => {
        res.send(resp.data[0]);
      })
      .catch((err) => {
        if (err?.response?.data) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(500).send(err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

app.get("/action/:moduleId/:actionId/:cardId", async (req, res) => {
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
    const params = await axios.get(
      `${consts.ACTIONPARAM}/${req.params.moduleId}/${req.params.actionId}/${req.params.cardId}`
    );
    res.send(filterConverter.filter(params.data[0]._data));
  } catch (err) {
    console.log(err);
    res.send(err.response?.data);
  }
});

module.exports = {
  path: "/api",
  handler: app,
};
