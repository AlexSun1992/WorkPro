import clientOs from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";

describe("clientOs utils", () => {
  let mock;

  test("getMobilePlatform for iOS + isWebview", () => {
    mock = clientOsTestData.variantA;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: "isWebview", platform: 7 });
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: "VueJS", platform: 8 });
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: "VueJS", platform: 7 });
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;

    expect(clientOs.getWebviewData(mock)).toStrictEqual({ webview: "VueJS", platform: 9 });
  });
});
