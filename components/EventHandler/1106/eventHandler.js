function validateMaskedField(field) {
  field.state = field.mask.length === field.value.length;
  field.error =
    field.mask.length === field.value.length
      ? null
      : `Значение должно быть не меньше ${field.mask.length} символов`;
}

async function eventHandler(data, item, callback) {
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const SREG_NUMBER = findField("SREG_NUMBER");
  const registrDocTS = findField("IDVEHDOCTYPE");
  const seriesNumberDoc = findField("SVEHDOC");
  const docNumber = findField("SVEHEPTS");
  const countryDoc = findField("IDCOUNTRYDOC");
  const IDVEHDOCTYPE = findField("IDVEHDOCTYPE");

  if (item.name === "IDVEHDOCTYPE" && item.value === 31) {
    SREG_NUMBER.required = true;
    if (!SREG_NUMBER.value) {
      SREG_NUMBER.state = false;
    }
    if (SREG_NUMBER.value) {
      SREG_NUMBER.state = true;
    }
  } else {
    SREG_NUMBER.required = false;
    SREG_NUMBER.state = null;
  }

  // Настраиваем видимость поля Серия и номер/Номер документа
  if (item.name === "IDVEHDOCTYPE") {
    if (item.value === 41) {
      seriesNumberDoc.visible = false;
      docNumber.visible = true;
    } else {
      seriesNumberDoc.visible = true;
      docNumber.visible = false;
    }
  }

  // Настраиваем поле Серия и номер документа
  if (item.name === "SVEHDOC") {
    if (IDVEHDOCTYPE.value === 31 && countryDoc.value === 179) {
      // Оставляем только буквы и цифры
      let rawValue = item.value.replace(/[^а-яА-Я0-9]/g, "");

      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      rawValue = rawValue.slice(0, 10);

      // Формируем строку с пробелом после 4-го символа
      let formattedValue =
        rawValue.length > 4
          ? rawValue.slice(0, 4) + " " + rawValue.slice(4)
          : rawValue;

      seriesNumberDoc.value = formattedValue;
    }

    if (IDVEHDOCTYPE.value === 30 && countryDoc.value === 179) {
      // Оставляем только буквы и цифры
      // let rawValue = seriesNumberDoc.value.replace(/[^а-яА-Я0-9]/g, "");

      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      // rawValue = rawValue.slice(0, 10);
      // seriesNumberDoc.value = seriesNumberDoc.value.slice(0, 10);
      // Оставляем только буквы и цифры
      let rawValue = seriesNumberDoc.value.replace(/[^а-яА-Я0-9]/g, "");

      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      rawValue = rawValue.slice(0, 10);

      // Формируем строку с пробелом после 4-го символа
      let formattedValue =
        rawValue.length > 4
          ? rawValue.slice(0, 4) + " " + rawValue.slice(4)
          : rawValue;

      // Обновляем значение в поле
      seriesNumberDoc.value = formattedValue;
    }
  }

  if (item.name === "SVEHEPTS") {
    validateMaskedField(docNumber);
  }

  return data;
}

function initHandler(data) {
  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const IDVEHDOCTYPE = findField("IDVEHDOCTYPE");
  const SREG_NUMBER = findField("SREG_NUMBER");
  const seriesNumberDoc = findField("SVEHDOC");
  const countryDoc = findField("IDCOUNTRYDOC");
  const docNumber = findField("SVEHEPTS");

  if (IDVEHDOCTYPE.value !== 31) {
    SREG_NUMBER.required = false;
  }

  if (IDVEHDOCTYPE.value === 41) {
    seriesNumberDoc.visible = false;
    docNumber.visible = true;
  }

  if (IDVEHDOCTYPE.value !== 41) {
    seriesNumberDoc.visible = true;
    docNumber.visible = false;
  }

  if (seriesNumberDoc.value) {
    if (IDVEHDOCTYPE.value === 31 && countryDoc.value === 179) {
      // Оставляем только буквы и цифры
      let rawValue = seriesNumberDoc.value.replace(/[^а-яА-Я0-9]/g, "");

      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      rawValue = rawValue.slice(0, 10);

      // Формируем строку с пробелом после 4-го символа
      let formattedValue =
        rawValue.length > 4
          ? rawValue.slice(0, 4) + " " + rawValue.slice(4)
          : rawValue;

      // Обновляем значение в поле
      seriesNumberDoc.value = formattedValue;
    }

    if (IDVEHDOCTYPE.value === 30 && countryDoc.value === 179) {
      // Оставляем только буквы и цифры
      let rawValue = seriesNumberDoc.value.replace(/[^а-яА-Я0-9]/g, "");

      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      rawValue = rawValue.slice(0, 10);

      // Формируем строку с пробелом после 4-го символа
      let formattedValue =
        rawValue.length > 4
          ? rawValue.slice(0, 4) + " " + rawValue.slice(4)
          : rawValue;

      // Обновляем значение в поле
      seriesNumberDoc.value = formattedValue;
      // Оставляем только буквы и цифры
      // let rawValue = seriesNumberDoc.value.replace(/[^а-яА-Я0-9]/g, "");
      // Ограничиваем количество Валидных символов до 10 (не считая пробела)
      // rawValue = rawValue.slice(0, 10);
      // seriesNumberDoc.value = seriesNumberDoc.value.slice(0, 10);
    }
  }

  if (
    docNumber &&
    Object.hasOwn(docNumber, "value") &&
    Object.hasOwn(docNumber, "mask")
  ) {
    validateMaskedField(docNumber);
  }

  return data;
}
