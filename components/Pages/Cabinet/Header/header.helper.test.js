import { getZone } from "./header.helper";

describe("Header.helper", () => {
  describe("getZone", () => {
    const key = "auth._token.local";

    test("Должно вернутьс значение main при наличии в cookies авторизационного токена", () => {
      jest
        .spyOn(window.document, "cookie", "get")
        .mockReturnValue(
          "auth.strategy=local; auth._refresh_token_expiration.local=false; _ym_uid=1752217954414338473; _ym_d=1752217954; location_user=%D0%9C%D0%BE%D1%81%D0%BA%D0%B2%D0%B0; kladr_id=7700000000000; lat=55.75396; lon=37.620393; auth.user_id=804016; _ym_isad=2; auth._token.local=Bearer%20198a2f3ea8a369ca7c241b01e2e69b117595a49cc5961eed58c58a09fb4e7cc3ea0640facbb23d0b475d33badd4; auth._token_expiration.local=1789640551063; auth._refresh_token.local=198a2f3ea8aa533d6c9a5d91738c6c32014ea27c1963c0c31ef66415aacce57107d70003f46899d88232e7a5814"
        );

      expect(getZone()).toBe("main");
    });

    test("Должно вернутьс значение free при отсутствии в cookies авторизационного токена", () => {
      jest
        .spyOn(window.document, "cookie", "get")
        .mockReturnValue(
          ""
        );

      expect(getZone()).toBe("free");
    });
  });
});
