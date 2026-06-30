import setupGenerateDeviceId from "../utils/clientOs/setupGenerateDeviceId";

export default async ({ $axios }) => {
  if (!process.client) return;

  await setupGenerateDeviceId($axios);
};
