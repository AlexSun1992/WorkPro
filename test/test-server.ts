/**
 * Сервер для тестирования API загрузки калькулятора
 * запускается командой:
 * npx nodemon .\test-server.ts
 * пример команды тестирования:
 * npx autocannon --duration=60 --connections=60 http://localhost:3000/test
 */
import * as express from "express";
import axios, { AxiosRequestConfig } from "axios";

type TestResult = {
  id: string;
  duration: number;
  isError: boolean;
};

type List<T> = {
  fields: { key: string; label: string }[];
  items: T[];
  total: number;
  addFields: Record<string, never>;
};
type ListItem777 = { REL: string; ID: number };

const BASE_URL = "https://new.reso.ru";

const testResult: TestResult[] = [];

async function fetchApi<T = any>(id: string, url: string, data?: Record<string, string>): Promise<T> {
  let isError = false;
  const startTime = Date.now();
  const request: AxiosRequestConfig = {
    baseURL: BASE_URL,
    url,
    headers: {
      cookie: "",
    },
  };
  if (data) {
    request.method = "POST";
    request.data = data;
  }
  return axios(request)
    .then((res) => res.data)
    .catch((err) => {
      isError = true;
    })
    .finally(() => {
      const endTime = Date.now();
      testResult.push({
        id,
        duration: endTime - startTime,
        isError,
      });
    });
}

async function fetchCalc(): Promise<void> {
  await fetchApi("menu", "/api/menu/55/777?zone=free");

  const listData = await fetchApi<List<ListItem777>>("list", "/api/list/55/777/%5B%5D?zone=free");

  const cardUrl = `/api/card/55/777/${listData.items[0].ID}/${listData.items[0].REL}?zone=free`;
  await fetchApi("card", cardUrl);
}

function calcLoadTest(): Promise<TestResult> {
  const startTime = Date.now();
  let isError = false;
  return fetchCalc()
    .then(() => {})
    .catch(() => {
      isError = true;
    })
    .then(() => {
      const endTime = Date.now();
      const result: TestResult = {
        id: "full",
        duration: endTime - startTime,
        isError,
      };
      testResult.push(result);
      return result;
    });
}

const app = express();
const port = 3000;

// npx autocannon --duration=60 --connections=60 http://localhost:3000/test
app.get("/test", async (req, res) => {
  res.send("ok");
});

// npx autocannon --duration=60 --connections=60 http://localhost:3000/osago-calc-show
app.get("/osago-calc-show", async (req, res) => {
  const data = await calcLoadTest();
  if (data.isError) {
    res.status(400);
  }
  res.json(data);
});

app.listen(port, () => {
  console.log(`Test server is running http://localhost:${port}`);
});
