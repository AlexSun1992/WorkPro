import clientOs from "./clientOs";
import clientOsTestData from "./clientOsTestData";
import { WEBVIEW_TYPES } from "./clientOsConstants";

describe("clientOs utils", () => {
  let mock;

  test("WebView must be VueJS", () => {
    mock = clientOsTestData.cookiesA;

    expect(clientOs.getWebview(mock)).toStrictEqual(WEBVIEW_TYPES.VueJS);
  });

  test("WebView must be isWebview", () => {
    mock = clientOsTestData.cookiesB;

    expect(clientOs.getWebview(mock)).toStrictEqual(WEBVIEW_TYPES.isWebview);
  });

  test("WebView must be isWebview_RM1", () => {
    mock = clientOsTestData.cookiesC;

    expect(clientOs.getWebview(mock)).toStrictEqual(WEBVIEW_TYPES.RM1);
  });

  test("WebView must be isWebview_RM2", () => {
    mock = clientOsTestData.cookiesD;

    expect(clientOs.getWebview(mock)).toStrictEqual(WEBVIEW_TYPES.RM2);
  });
});
