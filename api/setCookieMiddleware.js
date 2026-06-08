import handleSegmentCookies from "../utils/segmentCookies";

const segmentCookiesMiddleware = (req, res, next) => {
  const originalJson = res.json.bind(res);

  res.json = (body) => {
    handleSegmentCookies(res, body, {
      source: "express",
      method: req.method,
      url: req.originalUrl,
    });

    return originalJson(body);
  };

  next();
};

export default segmentCookiesMiddleware;
