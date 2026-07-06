/* eslint-disable */
import listConverter from "../converters/list";
import menuConverter from "../converters/menu";
import consts from "./urls";
import segmentCookiesMiddleware from "./setCookieMiddleware";
import { mobile2Service } from "../services/mobile2.services";
import setCommonHeaders from "./setHeaders";

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
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

router.use(cookieParser());
router.use(segmentCookiesMiddleware);

router.get("/list/:idModule/:idItem/:filters", async (req, res, next) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    let URL_ADDRESS;
    const idCard = /^\d+$/.test(req.params.filters) ? req.params.filters : 0;
    let settings = null;

    if (req?.query.zone !== "free") {
      URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}/0/${idCard}?json=${encodeURIComponent(
        req.params.filters
      )}`;
      settings = await mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idItem}`, {
        headers,
      });
    } else {
      URL_ADDRESS = `${consts.FREEDATA}/${req.params.idModule}/${req.params.idItem}/0/${idCard || 0}`;
    }
    const list = await mobile2ServiceInstance.get(URL_ADDRESS, { headers });
    res.send({
      ...listConverter.list(list.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS === 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

router.post("/list/:idModule/:idItem/:idCard?", async (req, res, next) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    let URL_ADDRESS;
    let settings = null;
    if (req?.query.zone !== "free") {
      const URLFilters = encodeURIComponent(JSON.stringify(req.body ?? {}));
      URL_ADDRESS = `${consts.DATA}/${req.params.idModule}/${req.params.idItem}/0/${
        req.params.idCard || 0
      }?json=${URLFilters}`;
      settings = await mobile2ServiceInstance.get(`${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idItem}`, {
        headers,
      });
    } else {
      URL_ADDRESS = `${consts.FREEDATA}/${req.params.idModule}/${req.params.idItem}/0/${req.params.idCard || 0}`;
    }
    const list = await mobile2ServiceInstance.get(URL_ADDRESS, { headers });
    res.send({
      ...listConverter.list(list.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS === 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

router.get("/onetomanylist/:idItem/:id/:rel", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    mobile2ServiceInstance({
      url: `${consts.ONETOMANYDATA}/${req.params.idItem}/${req.params.id}?rel=${req.params.rel}`,
      method: "GET",
      headers,
    })
      .then((resp) => {
        res.send(listConverter.list(resp.data));
      })
      .catch((err) => {
        if (err.response.data.STATUS === 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

router.get("/wizardlist/:idModule/:idWizard/:idItem", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    const settings = await mobile2ServiceInstance.get(
      `${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idWizard}`,
      { headers }
    );
    const wizardList = await mobile2ServiceInstance.get(
      `${consts.DATA}/${req.params.idModule}/${req.params.idWizard}/0/${req.params.idItem}?json={}`,
      { headers }
    );
    res.send({
      ...listConverter.list(wizardList.data),
      settings: settings?.data[0],
      subSettings: settings ? menuConverter.menuObject(settings?.data[0]) : undefined,
    });
  } catch (err) {
    if (err?.response?.data.STATUS === 401) {
      res.status(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
    }
  }
});

module.exports = {
  routerList: router,
};
