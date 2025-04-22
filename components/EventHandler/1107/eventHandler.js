(() => {
function findField(data, name) {
  console.log('card 1107');
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

  field.state = maskOnlyNumberSymbols.length === `${field.value}`.length;

  field.error = field.state ? null : "Введите корректное значение";
}

function isFormInvaild(data) {
  return data.some((field) => {
    const notRequiredField = Boolean(!field.visible || !field.required || field.name === 'SCODE');

    if (notRequiredField) {
      return false;
    }
    if (field.error || !field.state) {
      return true;
    }
  });
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
    "SOWNER_SECONDNAME",
    "SOWNER_FIRSTNAME",
    "SOWNER_THIRDNAME",
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
  const emptyBlock = findField(data, "Empty_1");

  if (phoneAuth?.mask) {
    validateMaskedFieldOnlyNumberSymbol(phoneAuth);
  }

  if (phoneNoAuth?.mask) {
    if (!phoneNoAuth.value) {
      phoneNoAuth.value = null;
    }
  }

  changeVisibleFields(data);
  checkSnilsFields(data);
  if (emptyBlock && phoneNoAuth) {
    emptyBlock.visible = phoneNoAuth.visible;
  }
  return data;
}

function eventHandler(data, item) {
  const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");
  const ownerPhone = findField(data, "SOWNER_PHONE");
  const Confirm = findField(data, "Item45937") || findField(data, "Item46218");

  const phoneAuth = findField(data, "SPHOLDER_PHONE");

  if (["BPHOLDER_SNILS", "BOWNER_SNILS"].includes(item.name)) {
    checkSnilsFields(data);
  }
  if (["NPERSONTYPE", "LISOWNER"].includes(item.name)) {
    changeVisibleFields(data);
    checkSnilsFields(data);
  }

  if (['IDPHOLDER_COUNTRY', 'IDOWNER_COUNTRY'].includes(item.name)) {
    const countryDoctypeMap = {
      IDPHOLDER_COUNTRY: 'IDPHOLDER_DOCTYPE',
      IDOWNER_COUNTRY: 'IDOWNER_DOCTYPE'
    }
    const doctypeField = findField(data, countryDoctypeMap[item.name]);
    if (!doctypeField.options?.length) {
      doctypeField.state = null;
      doctypeField.value = null;
    }
    if(doctypeField.options?.length) {
      const validValue = doctypeField.options.some((option) => option.value === doctypeField.value);
      if (!validValue) {
        doctypeField.value = doctypeField.options[0].value;
      }
    }
  }

  if (item.name === "SOWNER_PHONE") {
    if (phoneNoAuth?.mask) {
      validateMaskedFieldOnlyNumberSymbol(ownerPhone);
    }
  }
  if (item.name === "SPHOLDER_PHONENOAUTH") {
    if (phoneNoAuth?.mask) {
      validateMaskedFieldOnlyNumberSymbol(phoneNoAuth);
    }
  }

  if (item.name === "SPHOLDER_PHONE") {
    if (phoneAuth?.mask) {
      validateMaskedFieldOnlyNumberSymbol(phoneAuth);
    }
  }

  const formInvalid = isFormInvaild(data);
  if (Confirm) {
    Confirm.readonly = formInvalid; // нужно валидировать всю форму
  }

  if (['Item45937', 'Item46218'].includes(item.name)) {
    const smsCode = findField(data, "SCODE");
    const emptyBlock = findField(data, "Empty_1"); // хак для вёрстки
    Confirm.label = 'Запросить код повторно';
    if (smsCode && emptyBlock) {
      smsCode.visible = true;
      emptyBlock.visible = false;
    }
  }

  return data;
}
  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
