import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { detectIncognito } from "detectincognitojs";

let result = null;

const generateId = async () => {
  const incognito = await detectIncognito();
  const fpPromise = FingerprintJS.load();
  const fp = await fpPromise;
  const fIdResult = await fp.get();

  if (!result) {
    result = {
      sessionInfo: fIdResult.visitorId,
      isPrivate: incognito.isPrivate ? "Y" : "N",
    };
  }
  return result;
};

export default generateId;
