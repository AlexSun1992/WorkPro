/* eslint-disable */
import listConverter from "../converters/list";
import formConverter from "../converters/form";
import consts from "../api/urls";

const express = require("express");
const app = express();
const axios = require("axios");
const cookieParser = require("cookie-parser");

app.use(express.json());
app.use(cookieParser());

app.get("/wizard/:idModule/:idItem/:idCard", async (req, res) => {
  try {
    if (req.cookies) {
      axios.defaults.headers.common.Authorization =
        req.cookies["auth._token.local"];
      // axios.defaults.baseURL = 'https://mobiletest.reso.ru';
      axios.defaults.baseURL = "https://mobile2.reso.ru";
    }
    const ID = parseInt(req.params.idCard);
    const list = await axios.get(
      `${consts.DATA}/${req.params.idModule}/${req.params.idItem}?json={"pID":${ID}}`
    );
    const list_data = listConverter.list(list.data);
    let card = null;
    let result = null;
    if (list_data.items.length) {
      const REL = list_data.items[0].REL;
      card = await axios.get(
        `${consts.DATACARD}/${req.params.idModule}/${req.params.idItem}/${ID}?REL=${REL}`
      );
    }
    if (card) {
      result = { data: card.data[0]._data[0], meta: card.data[0]._meta };
    }
    res.send(result);
  } catch (err) {
    if (err.response.data.STATUS == 401) {
      res.sendStatus(err.response.data.STATUS).send(err.response.data);
    } else {
      res.status(err.response.data.STATUS).send(err.response.data);
    }
  }
});

module.exports = {
  path: "/api",
  handler: app,
};
