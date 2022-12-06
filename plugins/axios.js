export default function ({ $axios, reg }) {
  $axios.onRequest((config) => {
    config.headers.common["X-Application"] = "VueJS";
  });
}
