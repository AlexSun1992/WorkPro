/* eslint-disable */
import { mobile2Service } from "../services/mobile2.services.mjs";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

const requestIp = require("request-ip");

router.use(express.json());
router.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});
router.use(cookieParser());

router.get("/walletpass/generate_pass", (req, res) => {
  try {
    const ipAddress = requestIp.getClientIp(req);
    let mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    mobile2ServiceInstance.defaults.headers.common["Cookie"] = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;

    if (req?.headers?.authorization) {
      mobile2ServiceInstance.defaults.headers.common.Authorization = req.headers.authorization;
    } else {
      if (req?.cookies["auth._token.local"]) {
        mobile2ServiceInstance.defaults.headers.common.Authorization = req?.cookies["auth._token.local"];
      }
    }

    const URL_ADDRESS = `/policy/v1/rest/walletpass/generate_pass?policyID=${req.query.policyID}`; //2737247196
    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
    })
      .then(async (resp) => {
        res.setHeader("Content-Type", "application/vnd.apple.pkpass");
        res.setHeader("Content-Disposition", 'attachment; filename="reso.pkpass"');
        res.send(resp.data);
      })
      .catch((err) => {
        if (err.response?.status !== 200) {
          res.status(err.response.status).send(err.response.data);
          return;
        }
        if (err?.response?.data?.STATUS === 401) {
          res.status(err.response.data.STATUS).send(err.response.data);
        } else {
          res.status(err?.response?.data?.STATUS || 500).send(err?.response?.data || err);
        }
      });
  } catch (e) {
    res.send(e);
  }
});

module.exports = {
  routerAppleWallet: router,
};
