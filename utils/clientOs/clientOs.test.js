import clientOs from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";
import { OS_TYPES, WEBVIEW_TYPES } from "./clientOsConstants";

describe("clientOs utils", () => {
  let mock;

  test("getMobilePlatform for iOS + isWebview", () => {
    mock = clientOsTestData.variantA;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.isWebview, platform: OS_TYPES.webviewIos });
  });

  test("getMobilePlatform for Android + isWebview", () => {
    mock = clientOsTestData.variantAA;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.isWebview, platform: OS_TYPES.webviewAndroid });
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.VueJS, platform: OS_TYPES.android });
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.VueJS, platform: OS_TYPES.ios });
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.VueJS, platform: OS_TYPES.default });
  });
  test("getMobilePlatform for Web", () => {
    mock = clientOsTestData.variantE;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WEBVIEW_TYPES.VueJS, platform: OS_TYPES.web });
  });

  test("getVersion mobile platform", () => {
    mock = clientOsTestData.variantF;

    expect(clientOs.getWebviewApp(mock.headers.common.Cookie)).toBe(WEBVIEW_TYPES.RM1);
  });
});
