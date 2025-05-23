export function eventHandler(fields, action, func) {
  function findField(name) {
    const field = fields.find((item) => item.name === name);
    if (field) {
      return field;
    }

    throw new Error(`Поле ${name} не найдено в данных`);
  }

  if (action.value !== "Item36918") {
    findField(`Item36918`).visible = true;
    findField(`NPRICE`).visible = false;
  }

  if (func == "afterSave") {
    findField(`Item36918`).visible = false;
  }

  return fields;
}
