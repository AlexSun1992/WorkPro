(() => {
  function findField(data, name) {
    console.log("card 1107");
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    return null;
  }

  function formattedDate(dateStr) {
    const [day, month, year] = dateStr.split(".");
    return `${year}-${month}-${day}`;
  }

  function validateBirthdate(elements, name, personType) {
    const birthdateField = findField(elements, name);
    const minDate = new Date("1925-01-01");
    const currentDate = new Date();

    // Убираем время из всех дат
    minDate.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const dateString = formattedDate(birthdateField.value);
    const birthDate = new Date(dateString);

    birthDate.setHours(0, 0, 0, 0);

    if (isNaN(birthDate.getTime())) {
      birthdateField.state = false;
      return;
    }

    // Проверяем минимальную дату
    if (birthDate < minDate) {
      birthdateField.error = "Дата рождения не может быть раньше 01.01.1925";
      birthdateField.state = false;
      return;
    }

    // Вычисляем возраст
    const age = currentDate.getFullYear() - birthDate.getFullYear();
    const monthDiff = currentDate.getMonth() - birthDate.getMonth();
    const dayDiff = currentDate.getDate() - birthDate.getDate();

    // Если месяц рождения ещё не наступил, вычитаем 1 год
    const actualAge =
      monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    if (actualAge < 18) {
      birthdateField.error =
        personType.value === 2
          ? "Собственник должен быть совершеннолетним"
          : "Страхователь должен быть совершеннолетним";
      birthdateField.state = false;
      return;
    }

    birthdateField.error = null;
    birthdateField.state = true;
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
      const notRequiredField = Boolean(
        !field.visible || !field.required || field.name === "SCODE"
      );

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
        ownerSnilsControl?.visible &&
          ownerSnilsControl?.value &&
          !isOwner?.value
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
    emptyBlock.visible = phoneNoAuth.visible;
    return data;
  }

  function eventHandler(data, item) {
    const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");
    const ownerPhone = findField(data, "SOWNER_PHONE");
    const Confirm =
      findField(data, "Item45937") || findField(data, "Item46218");

  if (['Item45937', 'Item46218'].includes(item.name)) {
    const smsCode = findField(data, "SCODE");
    const emptyBlock = findField(data, "Empty_1"); // хак для вёрстки
    Confirm.label = 'Запросить код повторно';
    if (smsCode && emptyBlock) {
      smsCode.visible = true;
      emptyBlock.visible = false;
    }
  }

    if (["BPHOLDER_SNILS", "BOWNER_SNILS"].includes(item.name)) {
      checkSnilsFields(data);
    }
    if (["NPERSONTYPE", "LISOWNER"].includes(item.name)) {
      changeVisibleFields(data);
      checkSnilsFields(data);
    }

    if (["IDPHOLDER_COUNTRY", "IDOWNER_COUNTRY"].includes(item.name)) {
      const countryDoctypeMap = {
        IDPHOLDER_COUNTRY: "IDPHOLDER_DOCTYPE",
        IDOWNER_COUNTRY: "IDOWNER_DOCTYPE",
      };
      const doctypeField = findField(data, countryDoctypeMap[item.name]);
      if (!doctypeField.options?.length) {
        doctypeField.state = null;
        doctypeField.value = null;
      }
      if (doctypeField.options?.length) {
        const validValue = doctypeField.options.some(
          (option) => option.value === doctypeField.value
        );
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

    if (["Item45937", "Item46218"].includes(item.name)) {
      const smsCode = findField(data, "SCODE");
      const emptyBlock = findField(data, "Empty_1"); // хак для вёрстки
      Confirm.label = "Запросить код повторно";
      smsCode.visible = true;
      emptyBlock.visible = false;
    }

    const personType = findField(data, "NPERSONTYPE");
    // Проверяем дату рождения страхователя
    validateBirthdate(data, "DPHOLDER_BIRTHDATE", personType);
    // Проверяем дату рождения собственника (если это физическое лицо)
    if (personType && personType.value === 2) {
      validateBirthdate(data, "DOWNER_BIRTHDATE", personType);
    }

    return data;
  }
  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
