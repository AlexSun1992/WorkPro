const express = require("express");
const path = require("path");

const expressWinston = require("express-winston");
const winston = require("winston"); // for transports.Console
const { format } = require("winston");
const cookieParser = require("cookie-parser");
const requestIp = require("request-ip");

const { timestamp } = format;
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

const app = express();
const axios = require("axios");
const Sentry = require("@sentry/node");

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.SENTRY_LK_PRJ_DSN,
    environment: process.env.NODE_ENV,
  });
}
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    Sentry.captureException(error, {
      tags: {
        type: "backend-axios",
      },
      extra: {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
      },
    });

    return Promise.reject(error);
  }
);

app.use(Sentry.Handlers.requestHandler());

app.use(cookieParser());
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  res.setHeader("Cache-Control", "no-store");
  next();
});

app.use(express.static("../static/js"), (req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, must-revalidate");
  next();
});

// Import and Set Nuxt.js options
const { ConfigurationDocument } = require("@nuxtjs/auth-next");
const config = require("../nuxt.config");
const { isPermittedIp } = require("./index.helper");

config.dev = process.env.NODE_ENV !== "production";
config.prod = process.env.NODE_ENV === "production";

if (config.dev) {
  // Express отдает source-map клиенту
  const sourceMapPath = path.resolve(__dirname, "../.nuxt/dist/client");
  app.use("/_nuxt", express.static(sourceMapPath));
}

app.use(
  expressWinston.logger({
    meta: true,
    metaField: null, // this causes the metadata to be stored at the root of the log entry
    responseField: null,
    requestField: null,
    skip(req) {
      return !req.url.startsWith("/api");
    },
    dynamicMeta: (req, res) => {
      const meta = {};
      meta.status = res.statusCode;
      meta.userid = req?.cookies["auth.user_id"];
      return meta;
    },
    transports: [new winston.transports.Console()],
    format: winston.format.combine(timestamp(), winston.format.json()),
  })
);
app.use(
  expressWinston.errorLogger({
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json()),
  })
);

async function start() {
  // Init Nuxt.js
  app.use((req, res, next) => {
    const ipAddress = requestIp.getClientIp(req);
    const { allowedSubnetList } = config;
    const isAllowedIp = isPermittedIp(allowedSubnetList, ipAddress);

    const pathName = new URL(req.originalUrl, "https://fake.ru").pathname;
    const extension = path.extname(pathName);
    if (extension === ".map" && isAllowedIp === false) {
      res.sendStatus(404);
      return;
    }

    next();
  });

  const nuxt = new Nuxt(config);

  const { host, port } = nuxt.options.server;

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  } else {
    await nuxt.ready();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  app.use(Sentry.Handlers.errorHandler());

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
