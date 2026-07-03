import consts from "./urls";
import { mobile2Service } from "../services/mobile2.services";
import setCommonHeaders from "./setHeaders";

const cookieParser = require("cookie-parser");
const express = require("express");

const app = express();
const router = express.Router();

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

router.get("/menu/:idModule/?:idItem", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    mobile2ServiceInstance.defaults.headers.common.Cookie = req.headers?.cookie ? req.headers.cookie : null;
    let URL_ADDRESSS;
    if (req.query.zone === "free") {
      URL_ADDRESSS = encodeURI(`${consts.CLIENTFREEMENU}/${req.params.idModule}/${req.params.idItem}`);
    } else {
      URL_ADDRESSS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}`);
      if (req.params.idItem !== "null") {
        URL_ADDRESSS = encodeURI(`${consts.CLIENTMENU}/${req.params.idModule}/${req.params.idItem}`);
      }
    }
    mobile2ServiceInstance({
      url: URL_ADDRESSS,
      method: "GET",
      headers,
    })
      .then(async (resp) => {
        res.send(resp.data);
      })
      .catch((err) => {
        if (err?.response?.data.STATUS === 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = {
  routerMenu: router,
};
