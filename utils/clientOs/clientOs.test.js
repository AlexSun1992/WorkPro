import { clientOS } from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";

describe("clientOs utils", () => {
  let windowSpy;
  let mock;

  beforeEach(() => {
    // windowSpy = jest.spyOn(global, "navigator", "get");
    jest.resetAllMocks();
  });

  /* afterEach(() => {
    windowSpy.mockRestore();
  }); */

  test("getPlatform", () => {
    mock = clientOsTestData.variantA;
    Object.defineProperty(navigator, 'userAgentData', {value: mock.navigator.userAgentData, writable: true });
    /* windowSpy.mockImplementation(() => mock.navigator); */
    console.log(navigator.userAgetnData);
    expect(clientOS.getPlatform()).toBe('Windows');
  });

  test("getMobilePlatform for Android", () => {
    mock = clientOsTestData.variantB;
    Object.defineProperty(navigator, 'userAgent', {value: mock.navigator.userAgent, writable: true });

    expect(clientOS.getMobilePlatform()).toBe('Android');
  });

  test("getMobilePlatform for Iphone", () => {
    mock = clientOsTestData.variantC;
    Object.defineProperty(navigator, 'userAgent', {value: mock.navigator.userAgent, writable: true });

    expect(clientOS.getMobilePlatform()).toBe('IOS');
  });
});
