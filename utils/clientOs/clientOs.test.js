import clientOs from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";
import { OsTypes, WebviewTypes } from "./clientOsConstants.mjs";

describe("clientOs utils", () => {
  let mock;

  test("getMobilePlatform for iOS + isWebview", () => {
    mock = clientOsTestData.variantA;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WebviewTypes.isWebview, platform: OsTypes.ios });
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WebviewTypes.VueJS, platform: OsTypes.android });
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WebviewTypes.VueJS, platform: OsTypes.ios });
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: WebviewTypes.VueJS, platform: OsTypes.default });
  });
});
