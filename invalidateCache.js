const fs = require("fs");

const PATH = "./components-vue2/src/components/Card/CacheDataLocal";
const URL = "https://reso.ru";
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
        const list = await fetch(
          encodeURI(`${URL}/api/list/55/${menu}/[]?zone=free`)
        );
        if (list.ok) {
          const json = await list.json();
          const { REL, ID } = json.items[0];
          const card = await fetch(
            encodeURI(`${URL}/api/card/55/${menu}/${ID}/${REL}?zone=free`)
          );
          if (card.ok) {
            const data = await card.json();
            fs.writeFileSync(
              `${PATH}/${menu}/cache${menu}.json`,
              JSON.stringify(data)
            );
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
