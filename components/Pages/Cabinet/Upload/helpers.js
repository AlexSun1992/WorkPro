export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return "0 Байты";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Байты", "КБ", "МБ", "ГБ"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / k ** i).toFixed(dm))} ${sizes[i]}`;
}
