import generateId from "./generateDeviceId";

const setupGenerateDeviceId = async (axiosInstance) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const deviceId = await generateId();

    axiosInstance.interceptors.request.use((config) => {
      config.headers = config.headers || {};

      if (deviceId?.isPrivate !== undefined) {
        config.headers["is-private"] = deviceId.isPrivate;
      }
      if (deviceId?.sessionInfo !== undefined) {
        config.headers["session-info"] = deviceId.sessionInfo;
      }

      return config;
    });
  } catch (e) {
    console.log(e);
  }
};

export default setupGenerateDeviceId;
