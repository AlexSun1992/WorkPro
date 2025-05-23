const { isPermittedIp } = require("./index.helper");

describe("Функция определяет разрешенный IP", () => {
  it("Не отдаем файлы sourcemaps (клиентский ip не совпадает с sentry и не находится в разрешенном списке), функция возвращает false", () => {
    const clientIp = "127.0.0.1";
    const allowedSubnetList = ["192", "168", "200"];
    const sentryIp = `158.160.100.221`;
    expect(isPermittedIp(allowedSubnetList, clientIp, sentryIp)).toBe(false);
  });

  it("Отдаем файлы sourcemaps,(ip клиента свопадает с ip sentry) функция возвращает true", () => {
    const clientIp = "158.160.100.221";
    const allowedSubnetList = ["192", "168", "200"];
    const sentryIp = `158.160.100.221`;
    expect(isPermittedIp(allowedSubnetList, clientIp, sentryIp)).toBe(true);
  });

  it("Отдаем файлы sourcemaps (ip клиента находится в списке разрешенных ip)", () => {
    const clientIp = "192.168.144.3";
    const allowedSubnetList = ["192", "168", "200"];
    const sentryIp = `158.160.100.221`;
    expect(isPermittedIp(allowedSubnetList, clientIp, sentryIp)).toBe(true);
  });
});
