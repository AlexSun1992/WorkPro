import { config } from "./config";

async function eventHandler(data, item, callback) {
  function findFields(sources, type) {
    const fields = data.filter((item) =>
      sources.some((s) => item[s.name] === s.value)
    );
    if (fields) {
      return fields;
    }
    throw new Error(`не найдено в данных`);
  }

  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  console.log(item.name);

  const field = findField(item.name);

  console.log("field", field);

  const eventConfig = config.event;
  const fieldConfig = eventConfig.fields.find((f) => f.name === item.name);

  const computedList = eventConfig.fields.filter((f) => f.type === "computed");

  console.log(computedList);

  const computedConfig = computedList.find((c) => c.fields.includes(item.name));

  const computedPage = computedList.filter((c) => c.pages);

  const computedByPage = computedPage.find((c) => c.pages.includes(field.page));

  console.log("computedPage", computedByPage);

  if (fieldConfig) {
    const { conditions, type: typeConfig } = fieldConfig;
    conditions.forEach((condition) => {
      const { type, sources, property, value } = condition;
      const fields = findFields(sources, type);
      if (typeConfig === "changed") {
        fields.forEach((_, index) => {
          fields[index][property] = value;
        });
      }
    });
  }
  if (computedConfig) {
    const { conditions, name } = computedConfig;
    conditions.forEach((condition) => {
      const { type, sources, property } = condition;
      const fields = findFields(sources, type);
      if (property === "value") {
        const values = fields.map((field) =>
          field.options.find((o) => field.value === o.value)
        );
        const computedField = findField(name);
        computedField.value = [...values].map((n) => n?.text).join(" ");
      }
    });
  }

  const IDMODEL = findField("IDMODEL");
  const IDBRAND = findField("IDBRAND");
  const model = findField("IDMODEL");
  const sModel = findField("SMODEL");
  // if (item.name === "IDBRAND") {
  //   if (!IDBRAND.value) {
  //     IDMODEL.visible = true;
  //   }
  //   if (IDBRAND.value) {
  //     IDMODEL.visible = true;
  //   }
  // }
  //
  // Модель (не нашли в списке)
  // if (item.name === "IDMODEL") {
  //   if (model.value) {
  //     const idModelText = IDMODEL.options.find(
  //       (item) => item.value === IDMODEL.value
  //     ).text;
  //     const brandValue = IDBRAND.options.find(
  //       (item) => item.value === IDBRAND.value
  //     ).text;
  //
  //     if (brandValue === sModel.value) {
  //       sModel.value = `${sModel.value} ${idModelText}`;
  //     }
  //
  //     if (brandValue !== sModel.value) {
  //       sModel.value = `${brandValue} ${idModelText}`;
  //     }
  //   }
  // }
  return data;
}
async function initHandler(data, item, callback) {
  console.log(config);
  return data;
}

export { eventHandler, initHandler };
