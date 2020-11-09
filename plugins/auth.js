export default function ({ app, store, redirect }) {
  app.$axios.onError((error) => {
    let path = store.$router.history.current.fullPath;
    if (error.response.status == 401) {
      store.$router.push({
        path: "/login",
        query: {
          path: path,
        },
      });
    }
  });
  app.$axios.onRequest((config) => {
    // console.log(`Making request to ${config.url}`);
  });
}
