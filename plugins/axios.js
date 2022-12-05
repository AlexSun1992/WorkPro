export default function ({ $axios }) {
  $axios.onRequest((config) => {
    config.headers.common["X-Application"] = "VueJS";
  });
}
