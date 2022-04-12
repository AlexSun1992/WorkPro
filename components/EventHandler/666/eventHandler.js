function eventHandler(fields, action, func) {
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
    // this.$refs.recaptcha.execute();
    // findField(`Item36918`).visible = false;
    // console.log("afterSave");
    // console.log(action);
    // console.log(fields);
    // findField(`Item36918`).checked;
    // findField("SCAPTCHA").execute();
  }

  return fields;
}

export { eventHandler };
