/* eslint-disable */
import formConverter from "../converters/form";
import menuConverter from "../converters/menu";
import filterConverter from "../converters/filter";
import freeMethodsConverter from "../converters/forfreemethods";
import consts from "./urls";
import { mobile2Service } from "./../services/mobile2.services";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.get("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance = mobile2Service("https://mobiletest.reso.ru");
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
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
    mobile2ServiceInstance({
      url: URL_ADDRESSS,
      method: "GET",
    })
      .then(async (resp) => {
        res.send(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
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
router.get("/card/:idModule/:idItem/:idWizard/:idCard/:idRel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else {
      if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req?.cookies["auth._token.local"];
      }
    }
    const url = encodeURI(
      `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${req.params.idCard}/${req.params.idWizard}`
    );
    mobile2ServiceInstance({
      url: url,
      method: "GET",
    })
      .then(async (resp) => {
        res.send(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
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
router.get("/osago", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance({
      url: encodeURI(`${consts.FREEDATACARD}/55/738/0/0`),
      method: "GET",
    })
      .then(async (resp) => {
        let data = freeMethodsConverter.osago(
          await formConverter.form(resp.data, { ...req.query, ...req.params })
        );
        const menu = await mobile2ServiceInstance.get(
          `${consts.FREEMENU}/55/738`
        );
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

router.get("/card/js/:idModule/:idItem", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    let URL_ADDRESS;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
        }
      }
      URL_ADDRESS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}`);
    } else {
      URL_ADDRESS = encodeURI(
        `${consts.CLIENTFREEMENU}/${req.params.idModule}/${req.params.idItem}`
      );
    }
    mobile2ServiceInstance({
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

router.get("/file/:idReport/:idCard", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    if (req.query.zone !== "free") {
      if (req?.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (req?.cookies["auth._token.local"]) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
            req?.cookies["auth._token.local"];
        }
      }
    }
    mobile2ServiceInstance({
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
router.post(
  "/card/actionexec/:rowId/:actionId/:relId?/:relActionId",
  (req, res) => {
    try {
      const mobile2ServiceInstance = mobile2Service();
      if (req.headers.referer) {
        if (req.headers.referer.includes("testdms")) {
          mobile2ServiceInstance.defaults.baseURL =
            "https://mobiletest.reso.ru";
        }
      }
      if (req.headers.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (req.cookies) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
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
      mobile2ServiceInstance
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

router.post("/card/:idModule/:idItem/:id/:idRel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      if (req.headers.referer.includes("testdms")) {
        mobile2ServiceInstance.defaults.baseURL = "https://mobiletest.reso.ru";
      }
    }
    if (req.query.zone !== "free") {
      if (req.headers?.authorization) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.headers.authorization;
      } else {
        if (
          req.cookies &&
          Boolean(
            mobile2ServiceInstance?.defaults?.headers?.common?.Authorization
          )
        ) {
          mobile2ServiceInstance.defaults.headers.common.Authorization =
            req.cookies["auth._token.local"];
        }
      }
    }
    const typeReq = req.params.id === 0 ? "post" : "put";
    mobile2ServiceInstance[typeReq](
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

router.get("/action/:moduleId/:actionId/:cardId", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization =
        req.headers.authorization;
    } else {
      if (req.cookies) {
        mobile2ServiceInstance.defaults.headers.common.Authorization =
          req.cookies["auth._token.local"];
      }
    }
    const params = await mobile2ServiceInstance.get(
      `${consts.ACTIONPARAM}/${req.params.moduleId}/${req.params.actionId}/${req.params.cardId}`
    );
    res.send(filterConverter.filter(params.data[0]._data));
  } catch (err) {
    res.send(err.response?.data);
  }
});

module.exports = {
  routerCard: router,
};
