import { axiosErrorHelper } from "./axiosError.helper.mjs";
import testData from "./axiosError.helper.testsData.json";

describe("Axios.helper", () => {
  it("If valid ip and hostname resolve true status", () => {
    expect(axiosErrorHelper.isClientValid("192.168.1.2", "https://mobiletest.reso.ru")).toBeTruthy();
  });

  it("If Invalid ip and hostname resolve false status", () => {
    expect(axiosErrorHelper.isClientValid("123.123.0.0", "reso.ru")).toBeFalsy();
  });

  it("If Invalid ip but hostname is OK resolve false status", () => {
    expect(axiosErrorHelper.isClientValid("193.168.1.1", "https://mobiletest.reso.ru")).toBeTruthy();
  });

  it("If valid ip but hostname is BAD resolve false status", () => {
    expect(axiosErrorHelper.isClientValid("192.168.1.1", "reso.ru")).toBeFalsy();
  });

  it("If ip 127.0.0.1 and hostname resolve true status", () => {
    expect(axiosErrorHelper.isClientValid("127.0.0.1", "https://mobiletest.reso.ru")).toBeTruthy();
  });
});
