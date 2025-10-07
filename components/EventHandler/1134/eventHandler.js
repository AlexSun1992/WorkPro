export function eventHandler(data, item, callback) {
  if (item.name === "Item47359") {
    //нажали на кнопку
    data.find((f) => f.name === "SCODE").visible = true;
  }

  return data;
}
