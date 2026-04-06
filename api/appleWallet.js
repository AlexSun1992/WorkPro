// eslint-disable-next-line import/extensions
import { mobile2Service } from "../services/mobile2.services";

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
    const mobile2ServiceInstance = mobile2Service();
    if (req.headers.referer) {
      mobile2ServiceInstance.defaults.headers.common.Referer = req.headers.referer;
    }
    mobile2ServiceInstance.defaults.headers.common.Authorization = null;
    mobile2ServiceInstance.defaults.headers.common["user-agent"] = req.headers["user-agent"];
    mobile2ServiceInstance.defaults.headers.common.Cookie = req.headers?.cookie ? req.headers.cookie : null;
    mobile2ServiceInstance.defaults.headers.common["x-forwarded-for"] = ipAddress || null;

    const authFromCookies = req?.cookies["auth._token.local"] || "";
    const authorize = req?.headers?.authorization ? req.headers.authorization : authFromCookies;
    mobile2ServiceInstance.defaults.headers.common.Authorization = authorize;

    const URL_ADDRESS = `/policy/v1/rest/walletpass/generate_pass?policyID=${req.query.policyID}`;
    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
      responseType: "arraybuffer",
    })
      .then(async (resp) => {
        const buffer = await resp.data;
        res.setHeader("Content-Type", "application/vnd.apple.pkpass");
        res.setHeader("Content-Disposition", 'attachment; filename="reso.pkpass"');
        res.send(Buffer.from(buffer));
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status !== 200) {
          res.status(err.response?.status || 500).send(err.response?.data || err);
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
