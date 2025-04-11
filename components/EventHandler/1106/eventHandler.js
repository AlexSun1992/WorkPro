function validateMaskedFieldOnlySymbols(field) {
  const maskSize = field.mask.replace(/\s+/g, "");
  field.state = maskSize.length === field.value.length;
  field.error = field.state
    ? null
    : `Должно быть введено ${maskSize.length} символов`;
}

const REGNUM_MASK = 'A###AA###';

function eventHandler(data, item, callback) {
  console.log(item);

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

  if (item.name === "SREG_NUMBER") {
    SREG_NUMBER.value = item.value.toUpperCase();
    if (Boolean(SREG_NUMBER.mask)) {
      SREG_NUMBER.state = SREG_NUMBER.value.length > 7;
    } else {
      SREG_NUMBER.state = null;
    }
  }


  if (item.name === "SVEHDOC") {
    const field = findField("SVEHDOC");
    console.log(field, 1);
    field.value = item.value.toUpperCase();
    console.log(field, 2);
  }

  if (item.name === "IDVEHDOCTYPE") {
    if (item.value === 31) {
      SREG_NUMBER.required = true;
      SREG_NUMBER.mask = REGNUM_MASK;
      if (!SREG_NUMBER.value) {
        SREG_NUMBER.state = false;
      }
      if (SREG_NUMBER.value) {
        SREG_NUMBER.state = true;
      }
    }
    if (item.value !== 31) {
      SREG_NUMBER.mask = null;
      SREG_NUMBER.required = false;
      SREG_NUMBER.state = null;
    }
    // Настраиваем видимость поля Серия и номер/Номер документа
    if (item.value === 41) {
      seriesNumberDoc.visible = false;
      docNumber.visible = true;
    } else {
      seriesNumberDoc.visible = true;
      docNumber.visible = false;
    }
  }

  // Для России только цифры
  if (["IDCOUNTRYDOC", "IDVEHDOCTYPE"].includes(item.name)) {
    if (countryDoc.value !== 179) {
      seriesNumberDoc.mask = null;
    }
    if (countryDoc.value === 179) {
      const mask = IDVEHDOCTYPE.value === 31 ? '#### ######' : 'YYYY YYYYYY';
      seriesNumberDoc.mask = mask;
    }
  }

  if (
    ([31, 30].includes(IDVEHDOCTYPE.value) && countryDoc.value === 179)
  ) {
    validateMaskedFieldOnlySymbols(seriesNumberDoc);
  }

  if (docNumber.value && countryDoc.value === 179) {
    validateMaskedFieldOnlySymbols(docNumber);
  }

  return data;
}

function initHandler(data) {
  function findFieldfindField(name) {
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

  if (IDVEHDOCTYPE.value === 31) {
    SREG_NUMBER.mask = REGNUM_MASK;
  }

  seriesNumberDoc.visible = IDVEHDOCTYPE.value !== 41;
  docNumber.visible = IDVEHDOCTYPE.value === 41;


  if (
    ([31, 30].includes(IDVEHDOCTYPE.value) && countryDoc.value === 179)
  ) {
    validateMaskedFieldOnlySymbols(seriesNumberDoc);
  }

  if (docNumber.value) {
    validateMaskedFieldOnlySymbols(docNumber);
  }

  return data;
}
