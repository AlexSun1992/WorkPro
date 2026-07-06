// eslint-disable-next-line import/extensions
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

router.get("/walletpass/generate_pass", (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();

    const headers = setCommonHeaders(req);

    const URL_ADDRESS = `/policy/v1/rest/walletpass/generate_pass?policyID=${req.query.policyID}`;
    mobile2ServiceInstance({
      url: URL_ADDRESS,
      method: "GET",
      responseType: "arraybuffer",
      headers,
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
