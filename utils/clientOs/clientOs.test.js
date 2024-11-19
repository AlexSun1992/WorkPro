import { clientOS } from "./clientOs";
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

    expect(clientOS.getPlatform()).toBe('Windows');
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOS.getMobilePlatform()).toBe('Android');
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOS.getMobilePlatform()).toBe('IOS');
  });

  test("getMobilePlatform for empty", () => {
    mock = clientOsTestData.variantD;
    Object.defineProperty(navigator, 'userAgent', { value: mock.navigator.userAgent, writable: true });

    expect(clientOS.getMobilePlatform()).toBe(clientOS.getDefaultPlatform());
  });
});
