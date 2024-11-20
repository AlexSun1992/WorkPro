import { clientOs } from "./clientOs.mjs";
import { clientOsTestData } from "./clientOsTestData";

describe("clientOs utils", () => {
  let mock;

  beforeEach(() => {
    Object.defineProperty(navigator, 'userAgentData', { value: {}, writable: true, configurable: true });
    Object.defineProperty(navigator, 'userAgent', { value: "", writable: true, configurable: true });
  });

  test("getPlatform for Windows", () => {
    mock = clientOsTestData.variantA;
    Object.defineProperty(navigator, 'userAgentData', { value: mock.navigator.userAgentData, writable: true });

    expect(clientOs.getPlatform()).toBe('Windows');
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform()).toBe('Android');
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform()).toBe('IOS');
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOs.getMobilePlatform()).toBe(clientOs.getDefaultPlatform());
  });
});
