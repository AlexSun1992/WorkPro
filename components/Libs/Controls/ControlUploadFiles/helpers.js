import CryptoJS from "crypto-js";

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Байты";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Байты", "КБ", "МБ", "ГБ"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}

export function filterDropFilesByExtensions(files, extensions) {
  const b = new DataTransfer();
  if (Array.isArray(extensions)) {
    const upExtensions = extensions.map((item) => item.toUpperCase());
    for (let i = 0, len = files.length; i < len; i++) {
      if (upExtensions.includes(files[i].name.split(".").pop().toUpperCase()) && files[i].size) {
        b.items.add(files[i]);
      }
    }
    return b.files;
  }
  return files;
}

export async function getHash(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const fileContent = event.target.result;

      const hash = CryptoJS.SHA256(
        CryptoJS.enc.Latin1.parse(fileContent)
      ).toString();

      resolve(hash);
    };

    reader.onerror = (err) => reject(err);

    reader.readAsBinaryString(file);
  }).then((res) => res);
}
