const Minio = require("minio");
const fs = require("fs");
const path = require("path");

const minioClient = new Minio.Client({
  endPoint: "s3.reso.ru",
  port: 443,
  useSSL: true,
  accessKey: "te6e11Y0OIypjyGT",
  secretKey: "yLQuM9auBJTcRRG8",
});

function uploadFolder(directoryPath, bucketName) {
  fs.readdirSync(directoryPath).forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const stat = fs.statSync(filePath);
    const folder = directoryPath.split("img")[1].replace(/\\/g, "/");
    let fullPath;
    if (folder.length > 0) {
      fullPath = `img${folder}/${file}`;
    }
    if (folder.length === 0) {
      fullPath = `img/${file}`;
    }
    if (stat.isFile()) {
      // Отправка файла в Minio
      const stream = fs.createReadStream(filePath);

      minioClient.putObject(bucketName, fullPath, stream, stat.size, (err, etag) => {
        if (err) {
          console.log("Ошибка при отправке файла в Minio:", err);
        }
        console.log("Файл отправлен в Minio:", etag);
      });
    } else if (stat.isDirectory()) {
      // Рекурсивный вызов для отправки вложенной папки
      const subDirectoryPath = path.join(directoryPath, file);
      uploadFolder(subDirectoryPath, bucketName);
    }
  });
}
uploadFolder("./static/img", "reso-test");
