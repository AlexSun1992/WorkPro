// eslint-disable-next-line import/extensions
import { mobile2Service } from "../services/mobile2.services.mjs";

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

router.post("/suggestions/:address", async (req, res) => {
  try {
    const mobile2ServiceInstance = mobile2Service();
    const { data } = await mobile2ServiceInstance.post(
      `https://dadata.reso.ru/suggestions/api/4_1/rs/suggest/${req.params.address}`,
      req.body
    );
    res.send(data);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = {
  routerDadata: router,
};
