export async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));
  const field = copyData.find((f) => f.fieldId === item.fieldId);

  if (field?.name === "Item47674") {
    copyData.forEach((f) => {
      if (f.name === "SCODEFIELD") f.visible = true;
    });
  }
  return copyData;
}
