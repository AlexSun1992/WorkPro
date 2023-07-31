const fs = require("fs");

const PATH = "./components-vue2/src/components/Card/CacheDataLocal";
function invalidate(pathToDirectory) {
  fs.readdir(pathToDirectory, { withFileTypes: true }, (error, files) => {
    const directoriesInDIrectory = files
      .filter((item) => item.isDirectory())
      .map((item) => item.name);
    console.log(directoriesInDIrectory);
    fs.writeFileSync(
      `${PATH}/${directoriesInDIrectory[0]}/cache${directoriesInDIrectory[0]}.json`,
      "123"
    );
  });
}
invalidate(PATH);
