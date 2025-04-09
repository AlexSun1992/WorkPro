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
      ownerSnilsControl?.value && !isOwner?.value
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

function validateMaskedFieldOnlyNumberSymbol(field) {
  field.state = field.mask.replace(/[^#]/g, "").length === field.value.length;
  field.error =
    field.mask.replace(/[^#]/g, "").length === field.value.length
      ? null
      : `Значение должно быть не меньше ${field.mask.length} символов`;
}

function initHandler(data) {
  changeVisibleFields(data);
  checkSnilsFields(data);
  const phone = findField(data, "SPHOLDER_PHONE");

  if (phone.mask) {
    validateMaskedFieldOnlyNumberSymbol(phone);
  }

  return data;
}

function eventHandler(data, item) {
  if (["BPHOLDER_SNILS", "BOWNER_SNILS"].includes(item.name)) {
    checkSnilsFields(data);
  }
  if (["NPERSONTYPE", "LISOWNER"].includes(item.name)) {
    changeVisibleFields(data);
  }

  const phone = findField(data, "SPHOLDER_PHONE");

  if (item.name === "SPHOLDER_PHONE") {
    validateMaskedFieldOnlyNumberSymbol(phone);
  }

  return data;
}
