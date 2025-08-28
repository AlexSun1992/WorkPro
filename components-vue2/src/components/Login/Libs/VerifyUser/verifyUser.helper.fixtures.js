// eslint-disable-next-line import/prefer-default-export
export const response = {
  data: [
    {
      MESSAGE: "На Ваш номер телефона был отправлен код, который необходимо ввести ниже.",
      MESSAGE_CODE: 200,
    },
  ],
  status: 200,
  statusText: "OK",
  headers: {
    "accept-ranges": "bytes",
    connection: "close",
    "content-type": "application/json; charset=UTF-8",
    date: "Tue, 12 Jul 2022 10:10:01 GMT",
    server: "nginx",
    "transfer-encoding": "chunked",
    vary: "Accept-Charset, Accept-Encoding, Accept-Language, Accept",
    "x-powered-by": "Express",
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      recaptcha: process.env.RECAPTCHA_TEST_TOKEN,
    },
    method: "post",
    url: "/free/v2/sendsmscode2",
    data: `{"PHONE":"+7(901)-000-00-00","loginType":"phone","token":${process.env.RECAPTCHA_TEST_TOKEN},"modeType":"REG","error":true}`,
  },
  request: {},
};

export const responseTest = {
  data: [
    {
      MESSAGE: "Ты зарегистрирован в лучшей системе в мире!!!",
      MESSAGE_CODE: 200,
    },
  ],
  status: 200,
  statusText: "OK",
  headers: {
    "accept-ranges": "bytes",
    connection: "close",
    "content-type": "application/json; charset=UTF-8",
    date: "Tue, 12 Jul 2022 10:10:01 GMT",
    server: "nginx",
    "transfer-encoding": "chunked",
    vary: "Accept-Charset, Accept-Encoding, Accept-Language, Accept",
    "x-powered-by": "Express",
  },
  config: {
    transitional: {
      silentJSONParsing: true,
      forcedJSONParsing: true,
      clarifyTimeoutError: false,
    },
    transformRequest: [null],
    transformResponse: [null],
    timeout: 0,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
    maxContentLength: -1,
    maxBodyLength: -1,
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
      recaptcha: process.env.RECAPTCHA_TEST_TOKEN,
    },
    method: "post",
    url: "/free/v2/sendsmscode2",
    data: `{"PHONE":"+7(901)-000-00-00","loginType":"phone","token":${process.env.RECAPTCHA_TEST_TOKEN},"modeType":"REG","error":true}`,
  },
  request: {},
};
