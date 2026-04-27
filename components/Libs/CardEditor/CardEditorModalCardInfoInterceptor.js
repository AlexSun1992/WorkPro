let isFrozen = false;
let frozenQueue = [];

function freeze() {
  isFrozen = true;
}

function unfreeze() {
  isFrozen = false;
  frozenQueue.forEach((resolve) => resolve());
  frozenQueue = [];
}

export const cardEditorModalCardInfoInterceptor = (instance) => {
  const axios = instance.$axios;

  axios?.interceptors.request.use((config) => {
    if (!isFrozen) return config;

    return new Promise((resolve) => {
      frozenQueue.push(() => resolve(config));
    });
  });

  axios?.interceptors.response.use(
    (resp) => {
      const infoBlockData = getPropData("INFOBLOCK", resp.data);

      if (infoBlockData) {
        freeze();
        instance.$modalCardInfo.show(infoBlockData).then(unfreeze);
      }

      return resp;
    },
    (err) => {
      console.error(`cardEditorModalCardInfoInterceptor. ${err}`);

      return Promise.reject(err);
    }
  );
};

function getPropData(propName, obj) {
  if (Array.isArray(obj)) {
    return obj.find((item) => getPropData(propName, item));
  }

  return obj && obj[propName];
}
