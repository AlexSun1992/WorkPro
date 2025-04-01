import redirectFromEsia from "./sso";

global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve(),
  })
);

describe("SSO", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  it("Происходит успешный редирект из РЕСО на сайт партнера", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        headers: new Headers({
          "content-type": "application/json",
        }),
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            {
              _data: [
                {
                  SLINK: "https://id.alfabank.ru/oidc/authorize?",
                },
              ],
              _struct: [{}],
              _info: { recordCountError: false },
              _meta: { JSONWEBFIELDS: [] },
            },
          ]),
      })
    );
    const req = {
      get: jest.fn().mockReturnValue("http://test/login"),
      headers: { referer: "http://test/login" },
      hostname: "f.f",
      query: {
        auth: "",
        type: "alfa",
        ref: "/cabinet",
      },
    };
    const res = {
      cookie: jest.fn(),
      send: jest.fn(),
    };
    await redirectFromEsia(req, res);
    expect(res.send).toHaveBeenCalledWith(
      expect.stringMatching(
        /window\.location = "https:\/\/id\.alfabank\.ru\/oidc\/authorize\?"/
      )
    );
  });

  it("Происходит успешный редирект c сайт партнера на РЕСО", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        headers: new Headers({
          "content-type": "application/json",
        }),
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve([
            {
              ACCESS_TOKEN:
                "6w7kfiqdwpauum6esml9hcrfs4ozlak2s5bpb0iliuqv5h2h9q6bmopz0vj0sagpulk6nozagc4mttx2uub7y92t1vq",
              EXPIRES_IN: 3600,
              TOKEN_TYPE: "Bearer",
              ID: 1487505,
              REFRESH_TOKEN:
                "4byadga1s61sp2byfhm1vqu7rkiiwhaayn9own6fzvqsx59mgw4prqyvvht9xlcrtbgmqidfdcttw4u7gm8n886t52y",
            },
          ]),
      })
    );
    const req = {
      get: jest.fn().mockReturnValue("http://test/cabinet"),
      hostname: "f.f",
      cookies: {
        ref: "/cabinet",
        referror:
          "/login?error=%D0%9E%D1%88%D0%B8%D0%B1%D0%BA%D0%B0%20%D0%B0%D0%B2%D1%82%D0%BE%D1%80%D0%B8%D0%B7%D0%B0%D1%86%D0%B8%D0%B8",
      },
      query: { type: "alfa", state: "1b1c1188-a783-408c-b158-42ca3abf5f9a" },
    };
    const res = {
      cookie: jest.fn(),
      send: jest.fn(),
      redirect: jest.fn(),
      clearCookie: jest.fn(),
    };
    await redirectFromEsia(req, res);
    expect(res.redirect).toHaveBeenCalledWith(`https://f.f/cabinet`);
  });
});
