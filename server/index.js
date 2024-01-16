const express = require("express");
const path = require("path");
const expressWinston = require("express-winston");
const winston = require("winston"); // for transports.Console
const { format } = require("winston");
const cookieParser = require("cookie-parser");

const { timestamp } = format;
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

const app = express();
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
app.use(
  expressWinston.logger({
    meta: true,
    metaField: null, // this causes the metadata to be stored at the root of the log entry
    responseField: null,
    requestField: null,
    skip(req, res, err) {
      if (req.url.startsWith("/api")) {
        return false;
      }
      return true;
    },
    dynamicMeta: (req, res, err) => {
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

// Import and Set Nuxt.js options
const { RouteFilter } = require("express-winston");
const config = require("../nuxt.config.js");

config.dev = process.env.NODE_ENV !== "production";

async function start() {
  // Init Nuxt.js
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

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true,
  });
}

start();
