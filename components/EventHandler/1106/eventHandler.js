function validateMaskedFieldOnlySymbols(field) {
  const maskSize = field.mask.replace(/\s+/g, "");
  field.state = maskSize.length === field.value.length;
  field.error = field.state
    ? null
    : `Должно быть введено ${maskSize.length} символов`;
}

function getDocAndCountryValue(docField, docValue, CountryField, countryValue) {
  return docField.value === docValue && CountryField.value === countryValue;
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

  if (
    getDocAndCountryValue(countryDoc, 179, IDVEHDOCTYPE, 31) ||
    getDocAndCountryValue(countryDoc, 179, IDVEHDOCTYPE, 30)
  ) {
    validateMaskedFieldOnlySymbols(seriesNumberDoc);
  }

  if (docNumber.value) {
    validateMaskedFieldOnlySymbols(docNumber);
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

  if (
    getDocAndCountryValue(countryDoc, 179, IDVEHDOCTYPE, 31) ||
    getDocAndCountryValue(countryDoc, 179, IDVEHDOCTYPE, 30)
  ) {
    validateMaskedFieldOnlySymbols(seriesNumberDoc);
  }

  if (docNumber.value) {
    validateMaskedFieldOnlySymbols(docNumber);
  }

  return data;
}
