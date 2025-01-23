import clientOs from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";

describe("clientOs utils", () => {
  let mock;

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgentData', { value: {}, writable: true, configurable: true });
    Object.defineProperty(navigator, 'userAgent', { value: "", writable: true, configurable: true });
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform(mock.navigator.userAgent)).toStrictEqual({ isWebview: "isWebview", platform: 8 });
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform(mock.navigator.userAgent)).toStrictEqual({ isWebview: "isWebview", platform: 7 });
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform(mock.navigator.userAgent)).toStrictEqual({ isWebview: "", platform: "" });
  });
});
