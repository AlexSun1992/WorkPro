async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));

  function isValidValueLength(item, length) {
    return item.value?.length === length;
  }

  function getFieldFromItem(item) {
    const result = {...item?.value?.value};
    result.insuredIndex = item?.value.index;

    return result;
  }

  // Серия ВУ
  function validateSSERIA_LICENSE(item) {
    validFieldByLength(item, 4);
  }

  // Номер ВУ
  function validateSNUMBER_LICENSE(item) {
    validFieldByLength(item, 6);
  }

  function validateSPREV_LICSERIA(item) {
    validFieldByLength(item, 4);
  }

  function validateSPREV_LICNUMBER(item) {
    validFieldByLength(item, 6);
  }

  function validFieldByLength(item, length) {
    const insuredList = findField("INSURED_LIST")?.value;
    const field = insuredList[item.insuredIndex]?.find(field => field.name === item.name);

    if (item.value && !isValidValueLength(item, length)) {
      setFieldState(field, false, `Должно быть введено не более ${length} символов`);
      return;
    }

    setFieldState(field, true, null);
  }

  function validateDINSURED_STAGEDATE(item) {
    const insuredList = findField("INSURED_LIST")?.value;
    const list = insuredList[item.insuredIndex];
    const DINSURED_STAGEDATE = findFieldInInsuredList(list, "DINSURED_STAGEDATE") ;
    const DINSURED_BIRTHDATE = findFieldInInsuredList( list,"DINSURED_BIRTHDATE");
    const stageDate = getDate(DINSURED_STAGEDATE.value);
    const birthDate = getDate(DINSURED_BIRTHDATE.value);
    const temp = new Date();
    const currentDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());

    if (stageDate && currentDate < stageDate) {
      setFieldState(DINSURED_STAGEDATE, false, "Дата начала стажа не может быть позже текущей даты");
    }
    if (birthDate && currentDate < birthDate) {
      setFieldState(DINSURED_BIRTHDATE, false, "Дата рождения не может быть позже текущей даты");
    }
    else if (!stageDate || !birthDate) {
      setFieldState(DINSURED_STAGEDATE, true, null);
      setFieldState(DINSURED_BIRTHDATE, true, null);
    }
    else if (!isDatesLatestThenSomeYears(birthDate, stageDate, 16)) {
      setFieldState(DINSURED_STAGEDATE, false, "Дата начала стажа не может быть раньше 16 лет");
    }
    else {
      setFieldState(DINSURED_STAGEDATE, true, null);
      setFieldState(DINSURED_BIRTHDATE, true, null);
    }
  }

  function validateFormField(item) {
    const fieldsValidators = {
      SSERIA_LICENSE: validateSSERIA_LICENSE,
      SNUMBER_LICENSE: validateSNUMBER_LICENSE,
      SPREV_LICSERIA: validateSPREV_LICSERIA,
      SPREV_LICNUMBER: validateSPREV_LICNUMBER,
      DINSURED_STAGEDATE: validateDINSURED_STAGEDATE,
      DINSURED_BIRTHDATE: validateDINSURED_STAGEDATE
    };
    const field = getFieldFromItem(item);

    if (fieldsValidators[field.name]) {
      fieldsValidators[field.name](field);
    }
  }

  function isFormValid() {
    const insuredList = findField("INSURED_LIST")?.value;

    return !insuredList?.some(list => list.some(item => item.visible === true && item.state === false));
  }

  function setNextButtonState() {
    const nextButton = copyData.find(item => item.name === "Continue");
    const multiDrive = findField("BMULTI");

    nextButton.visible = isFormValid() || multiDrive?.value;
  }

  function setFieldState(field, state, errMessage) {
    if (field) {
      field.state = state;
      field.error = errMessage;
    }
  }

  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");
  const SHELP_INFO = copyData.find((f) => f.name === "SHELP_INFO");
  const BMULTI = data.find(({ name }) => name === "BMULTI");

  function findField(name) {
    const field = copyData.find((item) => item.name === name);

    if (field) {
      return field;
    }

    console.warn(`Поле ${ name } не найдено в данных`);
  }

  function isDatesLatestThenSomeYears(minDate, maxDate, years = 0) {
    const modifyMinDate = (new Date()).setFullYear(minDate.getFullYear() + years);

    return maxDate >= modifyMinDate;
  }

  function getDate(str) {
    const splitSrt = str?.split(".");

    if (Array.isArray(splitSrt) && splitSrt.length === 3) {
      return new Date(splitSrt.reverse());
    }

    return null;
  }

  function findFieldInInsuredList(list = [], name) {
    return list?.find(item => item.name === name);
  }

  function findDeepBasedField(dataSet, name, index) {
    const field = dataSet[index]?.find((el) => el.name === name);

    if (field !== undefined) {
      return field;
    }

    console.warn(`Поле ${ name } не найдено в ${ dataSet }`);
  }

  if (item.value?.name === "INSURED_LIST") {
    const previousSecondName = findDeepBasedField(
      INSURED_LIST.value,
      "SPREV_SECONDNAME",
      item.value.index
    );
    const previousCountry = findDeepBasedField(
      INSURED_LIST.value,
      "IDCOUNTRY_PREV",
      item.value.index
    );
    const previousSeries = findDeepBasedField(
      INSURED_LIST.value,
      "SPREV_LICSERIA",
      item.value.index
    );
    const previousNumber = findDeepBasedField(
      INSURED_LIST.value,
      "SPREV_LICNUMBER",
      item.value.index
    );
    const previousLicense = findDeepBasedField(
      INSURED_LIST.value,
      "LPREV_LICENSE",
      item.value.index
    );

    if (item?.value?.value?.value === true) {
      previousSecondName.visible = true;
      previousCountry.visible = true;
      previousSeries.visible = true;
      previousNumber.visible = true;
    }

    if (item?.value?.value?.value === false) {
      previousSecondName.visible = false;
      previousCountry.visible = false;
      previousSeries.visible = false;
      previousNumber.visible = false;
    }
  }

  if (BMULTI?.value === true) {
    INSURED_LIST.visible = false;
    SHELP_INFO.visible = true;
  } else {
    INSURED_LIST.visible = true;
    SHELP_INFO.visible = false;
  }

  validateFormField(item);
  setNextButtonState(item);

  return copyData;
}

function initHandler(data) {
  const copyData = JSON.parse(JSON.stringify(data));

  function findField(dataSet, name) {
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${ name } не найдено в данных`);
  }

  eventHandler.findField = findField;

  const INSURED_LIST = findField(copyData, "INSURED_LIST");

  INSURED_LIST.value.forEach((item, index) =>
    item.forEach((el, i) => {
      if (el.name === "LPREV_LICENSE") {
        const LPREV_LICENSE = findField(
          INSURED_LIST.value[index],
          "LPREV_LICENSE"
        );

        if (LPREV_LICENSE.value == "Y") {
          LPREV_LICENSE.value = true;
          findField(
            INSURED_LIST.value[index],
            "SPREV_SECONDNAME"
          ).visible = true;
          findField(INSURED_LIST.value[index], "IDCOUNTRY_PREV").visible = true;
          findField(INSURED_LIST.value[index], "SPREV_LICSERIA").visible = true;
          findField(
            INSURED_LIST.value[index],
            "SPREV_LICNUMBER"
          ).visible = true;
        }

        if (LPREV_LICENSE.value == "N") {
          LPREV_LICENSE.value = false;
          findField(
            INSURED_LIST.value[index],
            "SPREV_SECONDNAME"
          ).visible = false;
          findField(
            INSURED_LIST.value[index],
            "IDCOUNTRY_PREV"
          ).visible = false;
          findField(
            INSURED_LIST.value[index],
            "SPREV_LICSERIA"
          ).visible = false;
          findField(
            INSURED_LIST.value[index],
            "SPREV_LICNUMBER"
          ).visible = false;
        }
      }
    })
  );

  return copyData;
}
