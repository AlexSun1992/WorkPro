export default function ({ $axios }) {
  $axios.onRequest((config) => {
    config.headers.common["X-Forwarded-For"] = "test";
  });
}
