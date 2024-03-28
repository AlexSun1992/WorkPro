import fs from "fs";
import { createLogger, format, transports } from "winston";
import menuConverter from "../converters/menu.mjs";
import listConverter from "../converters/list.js";
import URLS  from "../api/urls.mjs";
import formConverter from "../converters/dataform.mjs";
import { mobile2Service } from "../services/mobile2.services.mjs";

const { combine, timestamp } = format;
const logger = createLogger({
  format: combine(timestamp(), format.splat(), format.json()),
  transports: [new transports.Console()],
});

const PATH = "./src/components/Card/CacheDataLocal";

const BASE_URL = "https://lk.reso.ru";
function invalidate(pathToDirectory) {
  fs.readdir(pathToDirectory, { withFileTypes: true }, async (error, files) => {
    const directoriesInDIrectory = files
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    if (!directoriesInDIrectory) {
      return;
    }
    try {
      for await (const menu of directoriesInDIrectory) {
        const settings = await fetch(
          encodeURI(`${BASE_URL}/${URLS.CLIENTFREEMENU}/55/${menu}`)
        );
        const list = await fetch(
          encodeURI(`${BASE_URL}/${URLS.FREEDATA}/55/${menu}/0/0`)
        );
        if (list.ok) {
          const jsonList = await list.json();
          const jsonSettings = await settings.json();
          const dataList = {
            ...listConverter.list(jsonList),
            settings: jsonSettings[0],
            subSettings: jsonSettings
              ? menuConverter.menuObject(jsonSettings[0])
              : undefined,
          };
          const { REL, ID } = dataList.items[0];
          const card = await fetch(
            encodeURI(`${BASE_URL}/${URLS.FREEDATACARD}/55/${menu}/${ID}?REL=${REL}`)
          );
          if (card.ok) {
            const mobile2ServiceInstance = mobile2Service();
            const jsonCard = await card.json();
            const data = await formConverter.form(
              jsonCard,
              {idItem: menu, zone: 'free'},
              mobile2ServiceInstance
            );
            const file = `${PATH}/${menu}/cache${menu}.json`;
            fs.writeFileSync(file, JSON.stringify(data));
            logger.log("info", `Файл ${file} успешно сохранен`);
          } else {
            throw new Error("Не удалось загрузить карточку");
          }
        } else {
          throw new Error("Не удалось загрузить список");
        }
      }
    } catch (e) {
      console.error(e);
    }
  });
}
invalidate(PATH);
