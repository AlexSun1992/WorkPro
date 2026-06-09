import handleSegmentCookies from "../utils/segmentCookies";

export default ({ $axios, res, req }) => {
  $axios.onResponse((response) => {
    handleSegmentCookies(req, res, response.data, {
      source: "nuxt-plugin",
      url: response.config?.url,
    });
    return response;
  });
};
