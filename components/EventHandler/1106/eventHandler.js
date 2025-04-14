(() => {
function validateMaskedFieldOnlySymbols(field) {
  const maskSize = field.mask?.replace(/\s+/g, "");
  field.state = maskSize?.length === field.value.length;
  field.error = field.state
    ? null
    : `Должно быть введено ${maskSize.length} символов`;
}
function findField(data, name) {
  const field = data.find((item) => item.name === name);
  if (field) {
    return field;
  }
  console.error(`Поле ${name} не найдено в данных`)
  return {};
}

const REGNUM_MASK = 'Y###YY###';
const STS_MASK = '#### ######';
const PTS_MASK = 'YYYY YYYYYY';

function eventHandler(data, item, callback) {
  const SREG_NUMBER = findField(data, "SREG_NUMBER");
  const seriesNumberDoc = findField(data, "SVEHDOC");
  const docNumber = findField(data, "SVEHEPTS");
  const countryDoc = findField(data, "IDCOUNTRYDOC");
  const IDVEHDOCTYPE = findField(data, "IDVEHDOCTYPE");

  if (item.name === "SREG_NUMBER") {
    SREG_NUMBER.value = item.value.toUpperCase();
    if (Boolean(SREG_NUMBER.mask)) {
      SREG_NUMBER.state = SREG_NUMBER.value.length > 7;
    } else {
      SREG_NUMBER.state = null;
    }
  }


  if (item.name === "SVEHDOC") {
    const field = findField(data, "SVEHDOC");
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
      const mask = IDVEHDOCTYPE.value === 31 ? STS_MASK : PTS_MASK;
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
  console.log('initHandler, 1106')
  const IDVEHDOCTYPE = findField(data, "IDVEHDOCTYPE");
  const SREG_NUMBER = findField(data, "SREG_NUMBER");
  const seriesNumberDoc = findField(data, "SVEHDOC");
  const countryDoc = findField(data, "IDCOUNTRYDOC");
  const docNumber = findField(data, "SVEHEPTS");

  seriesNumberDoc.visible = IDVEHDOCTYPE.value !== 41;
  docNumber.visible = IDVEHDOCTYPE.value === 41;

  if (countryDoc.value !== 179) {
    seriesNumberDoc.mask = null;
    SREG_NUMBER.mask = null;
  }
  if (countryDoc.value === 179) {
    const mask = IDVEHDOCTYPE.value === 31 ? STS_MASK : PTS_MASK;
    seriesNumberDoc.mask = mask;
    SREG_NUMBER.mask = IDVEHDOCTYPE.value === 31 ? REGNUM_MASK : null;
  }

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
  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
