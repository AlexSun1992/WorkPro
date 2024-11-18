import { clientOS } from "./clientOs";
import { clientOsTestData } from "./clientOsTestData";

describe("clientOs utils", () => {
  let windowSpy;
  const mock = clientOsTestData.variantA;

  beforeEach(() => {
    windowSpy = jest.spyOn(global, "navigator", "get");
  });

  afterEach(() => {
    windowSpy.mockRestore();
  });

  test("getFromNavigator", () => {
    windowSpy.mockImplementation(() => mock.navigator);

    expect(clientOS.getPlatform()).toBe('Win32');
  });
});
