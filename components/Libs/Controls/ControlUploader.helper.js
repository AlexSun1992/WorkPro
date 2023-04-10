export function getSynchronizedFileList(hub) {
  const dt = new DataTransfer();
  hub.forEach((item) => {
    const file = new File([item], `${item.name}`, { type: `${item.type}` });
    dt.items.add(file);
  });
  const fileList = dt.files;
  return fileList;
}
