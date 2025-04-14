function findField(data, name) {
  const field = data.find((item) => item.name === name);
  if (field) {
    return field;
  }
  return null;
}

function findAllFields(data, arr) {
  return arr.reduce((acc, cur) => {
    const newField = findField(data, cur);
    if (newField) {
      return [...acc, newField];
    }
    return acc;
  }, []);
}

function validateMaskedFieldOnlyNumberSymbol(field) {
  const maskOnlyNumberSymbols = field.mask.replace(/[^#]/g, "");

  field.state = maskOnlyNumberSymbols.length + 1 === `${field.value}`.length;

  field.error = field.state ? null : "Введите корректное значение";
}

// управляем полями СНИЛС
function checkSnilsFields(data) {
  const [
    holderSnilsField,
    holderSnilsControl,
    ownerSnilsField,
    ownerSnilsControl,
  ] = findAllFields(data, [
    "SPHOLDER_SNILS",
    "BPHOLDER_SNILS",
    "SOWNER_SNILS",
    "BOWNER_SNILS",
  ]);
  const isOwner = findField(data, "LISOWNER");
  if (holderSnilsField) {
    holderSnilsField.visible = Boolean(holderSnilsControl?.value);
  }
  if (ownerSnilsField) {
    ownerSnilsField.visible = Boolean(
      ownerSnilsControl?.visible && ownerSnilsControl?.value && !isOwner?.value
    );
  }
}

// управляем полями Собственник
function changeVisibleFields(data = false) {
  const OWNER_FIELDS_NAME = [
    "SOWNER_SECOND",
    "SOWNER_FIRST",
    "SOWNER_THIRD",
    "DOWNER_BIRTHDATE",
    "SOWNER_PHONE",
    "SOWNER_EMAIL",
    "IDOWNER_COUNTRY",
    "IDOWNER_DOCTYPE",
    "SOWNER_SERIES",
    "SOWNER_PNUMBER",
    "SFULLOWNER_ADDRESS",
    "BOWNER_SNILS",
  ];
  const JUR_FIELDS_NAME = [
    "SJUR_INN",
    "SJUR_NAME",
    "SJUR_PHONE",
    "IDJUR_DOCTYPE",
    "SJUR_SERIES",
    "SJUR_NUMBER",
    "SJUR_ADDRESS",
  ];

  const [ownerSnilsField, ownerSnilsControl] = findAllFields(data, [
    "SOWNER_SNILS",
    "BOWNER_SNILS",
  ]);

  const isIndividual = findField(data, "NPERSONTYPE");
  const isOwner = findField(data, "LISOWNER");
  const jurFields = findAllFields(data, JUR_FIELDS_NAME);
  const ownerFields = findAllFields(data, OWNER_FIELDS_NAME);
  if (isOwner?.value) {
    [...ownerFields, ...jurFields, isIndividual, ownerSnilsField].forEach(
      (field) => {
        field.visible = false;
      }
    );
  } else {
    const isShowJur = isIndividual?.value === 1;
    if (isIndividual) {
      isIndividual.visible = true;
    }
    jurFields.forEach((field) => {
      field.visible = !isShowJur;
    });
    ownerFields.forEach((field) => {
      field.visible = Boolean(isShowJur);
    });
    if (ownerSnilsField) {
      ownerSnilsField.visible = Boolean(
        ownerSnilsControl?.value && !isOwner?.value
      );
    }
  }
}

function initHandler(data) {
  const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");
  const phoneAuth = findField(data, "SPHOLDER_PHONE");

  if (phoneAuth && phoneAuth.mask) {
    phoneAuth.value = `9${phoneAuth.value}`;
    validateMaskedFieldOnlyNumberSymbol(phoneAuth);
  }

  if (phoneNoAuth && phoneNoAuth.mask) {
    if (!phoneNoAuth.value) {
      phoneNoAuth.value = null;
    }
  }

  changeVisibleFields(data);
  checkSnilsFields(data);
  return data;
}

function eventHandler(data, item) {
  const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");

  const phoneAuth = findField(data, "SPHOLDER_PHONE");

  if (["BPHOLDER_SNILS", "BOWNER_SNILS"].includes(item.name)) {
    checkSnilsFields(data);
  }
  if (["NPERSONTYPE", "LISOWNER"].includes(item.name)) {
    changeVisibleFields(data);
    checkSnilsFields(data);
  }

  if (item.name === "SPHOLDER_PHONENOAUTH") {
    if (phoneNoAuth && phoneNoAuth.mask) {
      phoneNoAuth.value = `9${item.value}`;
      validateMaskedFieldOnlyNumberSymbol(phoneNoAuth);
    }
  }

  if (item.name === "SPHOLDER_PHONE") {
    if (phoneAuth && phoneAuth.mask) {
      phoneAuth.value = `9${item.value}`;
      validateMaskedFieldOnlyNumberSymbol(phoneAuth);
    }
  }

  return data;
}
