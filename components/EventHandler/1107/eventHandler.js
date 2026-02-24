import { findField } from "../helpers";
import { scrollToCardHead } from "@/utils/scroll";
import { setFieldsVisibleState } from "@/components/EventHandler/helpers/eventHandlerHelpers";

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
    const notRequiredField = Boolean(!field.visible || !field.required || field.name === "SCODE");

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
  const [holderSnilsField, holderSnilsControl, ownerSnilsField, ownerSnilsControl] = findAllFields(data, [
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
    ownerSnilsField.visible = Boolean(ownerSnilsControl?.visible && ownerSnilsControl?.value && !isOwner?.value);
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
    "Empty_01",
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

  const [ownerSnilsField, ownerSnilsControl] = findAllFields(data, ["SOWNER_SNILS", "BOWNER_SNILS"]);

  const isIndividual = findField(data, "NPERSONTYPE");
  const isOwner = findField(data, "LISOWNER");
  const jurFields = findAllFields(data, JUR_FIELDS_NAME);
  const ownerFields = findAllFields(data, OWNER_FIELDS_NAME);
  if (isOwner?.value) {
    [...ownerFields, ...jurFields, isIndividual, ownerSnilsField].forEach((field) => {
      field.visible = false;
    });
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
      ownerSnilsField.visible = Boolean(ownerSnilsControl?.value && !isOwner?.value);
    }
  }
}

function validationSeriaAndNumber(elements, doctypeName, seriaName, numberName) {
  const doctype = findField(elements, doctypeName);
  const seria = findField(elements, seriaName);
  const number = findField(elements, numberName);

  if (doctype.value === 35) {
    seria.mask = "####";
    number.mask = "######";
  } else {
    seria.mask = "";
    number.mask = "";
  }
}

function formattedDate(dateStr) {
  const [day, month, year] = dateStr.split(".");
  return `${year}-${month}-${day}`;
}

function validateBirthdate(elements, name, personType) {
  const birthdateField = findField(elements, name);
  const isOwner = findField(elements, "LISOWNER");

  if (!birthdateField?.value) {
    return;
  }
  const minDate = new Date("1925-01-01");
  const currentDate = new Date();
  // Убираем время из всех дат
  minDate.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);
  const dateString = formattedDate(birthdateField.value);
  const birthDate = new Date(dateString);
  birthDate.setHours(0, 0, 0, 0);
  // Вычисляем возраст
  const age = currentDate.getFullYear() - birthDate.getFullYear();
  const monthDiff = currentDate.getMonth() - birthDate.getMonth();
  const dayDiff = currentDate.getDate() - birthDate.getDate();
  // Если месяц рождения ещё не наступил, вычитаем 1 год
  const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

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

  if (actualAge < 18) {
    const TOKEN_NAME = "auth._token.local";
    const tokenStorage = localStorage.getItem(TOKEN_NAME);

    const isAuth = tokenStorage && tokenStorage !== "false";
    const isOwnerType = personType.value === 1;
    const isOwnerCase = isOwner.value === false && name === "DOWNER_BIRTHDATE" && isOwnerType;
    let subject = "Собственник";

    if (isAuth) {
      subject = isOwnerType ? "Собственник" : "Страхователь";
    }

    if (!isAuth) {
      subject = isOwnerCase ? "Собственник" : "Страхователь";
    }

    birthdateField.error = `${subject} должен быть совершеннолетним`;

    birthdateField.state = false;
    return;
  }

  birthdateField.error = null;
  birthdateField.state = true;
}

function validationFIO(elements, field) {
  const fioItem = findField(elements, field.name);
  if (!fioItem?.value) {
    if (fioItem.required === false) {
      fioItem.error = null;
      fioItem.state = null;
    }
    return;
  }

  const regExp = fioItem?.regex ? new RegExp(fioItem.regex) : /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;

  if (!regExp.test(fioItem.value)) {
    fioItem.error = fioItem.required ? "Обязательное поле.Укажите ФИО кириллицей" : "Укажите ФИО кириллицей";
    fioItem.state = false;
  } else {
    fioItem.error = null;
    fioItem.state = true;
  }
}

export function initHandler(data) {
  if (data[0]?.id !== "1107") return;
  console.log("init", 1107);

  const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");
  const phoneAuth = findField(data, "SPHOLDER_PHONE");
  const emptyBlock = findField(data, "Empty_1");
  const idJURdocType = findField(data, "IDJUR_DOCTYPE");
  const personType = findField(data, "NPERSONTYPE");
  const isOwner = findField(data, "LISOWNER");
  const jurDocsData = findAllFields(data, ["SJUR_SERIES", "SJUR_NUMBER"]);

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

  if (!isOwner?.value && personType.value === 2) {
    setFieldsVisibleState(jurDocsData, idJURdocType?.value === 62);
  }

  if (emptyBlock && phoneNoAuth) {
    emptyBlock.visible = phoneNoAuth.visible;
  }
  scrollToCardHead(".wizard_osago");

  return data;
}

export function eventHandler(data, item, action) {
  const phoneNoAuth = findField(data, "SPHOLDER_PHONENOAUTH");
  const Confirm = findField(data, "Item46218");
  const smsCode = findField(data, "SCODE");
  const actionId = 46218;
  const idJURdocType = findField(data, "IDJUR_DOCTYPE");
  const personType = findField(data, "NPERSONTYPE");
  const isOwner = findField(data, "LISOWNER");
  const jurDocsData = findAllFields(data, ["SJUR_SERIES", "SJUR_NUMBER"]);

  if (["BPHOLDER_SNILS", "BOWNER_SNILS"].includes(item.name)) {
    checkSnilsFields(data);
  }

  if (["NPERSONTYPE", "LISOWNER"].includes(item.name)) {
    changeVisibleFields(data);
    checkSnilsFields(data);
  }

  if (!isOwner?.value && personType.value === 2) {
    setFieldsVisibleState(jurDocsData, idJURdocType?.value === 62);
  }

  if (action === "beforeSave") {
    if (phoneNoAuth.state === true && !smsCode.visible) {
      this.$store.commit("data_card/setFetchingAction", {
        actionId,
        isFetching: true,
      });
      this.$store.commit("data_card/saveButtonClicked", true);
    }
  }

  if (action === "afterSave") {
    if (phoneNoAuth.state === true && !smsCode.visible) {
      smsCode.visible = true;
      this.$store.commit("data_card/setFetchingAction", {
        actionId,
        isFetching: false,
      });
    }
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
      const validValue = doctypeField.options.some((option) => option.value === doctypeField.value);
      if (!validValue) {
        doctypeField.value = doctypeField.options[0].value;
      }
    }
  }

  const formInvalid = isFormInvaild(data);
  if (Confirm) {
    Confirm.readonly = formInvalid; // нужно валидировать всю форму
  }

  if (item.name === "Item46218") {
    const emptyBlock = findField(data, "Empty_1"); // хак для вёрстки
    Confirm.label = "Запросить код повторно";
    if (smsCode && emptyBlock) {
      smsCode.visible = true;
      emptyBlock.visible = false;
    }
  }

  validateBirthdate(data, "DPHOLDER_BIRTHDATE", personType);
  // Проверяем дату рождения собственника (если это физическое лицо)
  if (personType?.value === 1) {
    validateBirthdate(data, "DOWNER_BIRTHDATE", personType);
  }

  // Тип документа для страхователя
  validationSeriaAndNumber(data, "IDPHOLDER_DOCTYPE", "SPHOLDER_SERIES", "SPHOLDER_PNUMBER");

  // Тип документа для собственника
  validationSeriaAndNumber(data, "IDOWNER_DOCTYPE", "SOWNER_SERIES", "SOWNER_PNUMBER");

  // ФИО валидация

  if (item.name !== undefined && ["SECONDNAME", "FIRSTNAME", "THIRDNAME"].some((name) => item.name.includes(name))) {
    validationFIO(data, item);
  }

  return data;
}
