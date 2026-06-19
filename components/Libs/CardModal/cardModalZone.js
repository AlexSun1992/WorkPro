import Cookies from "js-cookie";
// eslint-disable-next-line import/extensions
import { TOKEN_NAME } from "@/components/Card/helpers.fixtures";

/**
 * @returns {"token" | "free"}
 */
export function resolveZone() {
  const token = Cookies.get(TOKEN_NAME);

  return token && token !== "false" ? "token" : "free";
}
