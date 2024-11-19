import { clientOS } from "../utils/clientOs/clientOs";

export default function (param) {
  let platform = "VueJs";
  const utils = clientOS;

  param.$axios.onRequest(config => {
    try {
      platform = utils.getMobilePlatform();
    } catch (err) {
      platform = "VueJs";
    } finally {
      config.headers.common["X-OS"] = platform;
    }
  });
}
