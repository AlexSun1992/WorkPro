/* eslint-disable */

import { axios } from "./api";

const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const router = express.Router();

router.use(express.json());
router.use(cookieParser());

router.post("/suggestions/:address", async (req, res) => {
  try {
    const { data } = await axios.post(
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
