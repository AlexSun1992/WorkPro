import setupGenerateDeviceId from "../utils/clientOs/setupGenerateDeviceId";

export default async ({ $axios }) => {
  if (process.client) {
    await setupGenerateDeviceId($axios);
  }
};
