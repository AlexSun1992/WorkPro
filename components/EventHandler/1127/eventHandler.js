export async function eventHandler(data, item, callback) {
  const field = data.find((f) => f.fieldId === item.fieldId);
  if (!field) {
    return data;
  }

  if (field.name === "Item47280") {
    data.find((f) => f.name === "SCODE_PHONE").visible = true;
    data.find((f) => f.name === "Empty_1").visible = false;
  }
  return data;
}
