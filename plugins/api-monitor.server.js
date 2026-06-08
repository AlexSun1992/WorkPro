import handleSegmentCookies from "../utils/segmentCookies";

export default ({ $axios, res }) => {
  $axios.onResponse((response) => {
    handleSegmentCookies(res, response.data, {
      source: "nuxt-plugin",
      url: response.config?.url,
    });
    return response;
  });
};
