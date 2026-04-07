import Cookies from "js-cookie";

import { TOKEN_NAME } from "@/components/EventHandler/helpers";

export function registerZoneInterceptor(axios) {
  axios.interceptors.request.use((config) => {
    if (!config.url?.startsWith("/api/")) return config;

    const token = Cookies.get(TOKEN_NAME);
    const zone = token && token !== "false" ? "token" : "free";

    // Вырезаем zone из URL-строки
    const [path, search] = (config.url || "").split("?");
    const urlParams = new URLSearchParams(search || "");
    urlParams.delete("zone");
    const cleanSearch = urlParams.toString();
    config.url = cleanSearch ? `${path}?${cleanSearch}` : path;

    // Вырезаем zone из config.params
    if (config.params) {
      const { zone: _, ...restParams } = config.params;
      config.params = restParams;
    }

    // Ставим zone=free только если куки нет
    if (zone === "free") {
      config.params = { ...(config.params || {}), zone };
    }

    return config;
  });
}
