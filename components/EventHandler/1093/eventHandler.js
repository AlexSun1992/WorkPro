async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));
  const fieldsDescription = {
    SSERIA_LICENSE: { valueLength: 4 },
    SPREV_LICSERIA: { valueLength: 4 },
    SNUMBER_LICENSE: { valueLength: 6 },
    SPREV_LICNUMBER: { valueLength: 6 },
    DINSURED_STAGEDATE: {},
  };

  function isValidValueLength(item, length) {
    return item.value?.length === length;
  }

  function getFieldFromItem(item) {
    let nextItem = item;

    while (nextItem) {
      const keys = Object.keys(nextItem);

      if (keys.every((key) => [ "value", "name", "fieldId" ].includes(key))) {
        return nextItem;
      }

      nextItem = nextItem?.value ?? null;
    }

    return nextItem;
  }

  // Серия ВУ
  function validateSSERIA_LICENSE(item) {
    if (!isValidValueLength(item, 4)) {
      console.log(`~~~~~ validateSSERIA_LICENSE isValid: FASLE`);

      return false;
    }

    console.log(`~~~~~ validateSSERIA_LICENSE isValid: TRUE`);
  }

  // Номер ВУ
  function validateSNUMBER_LICENSE(item) {
    if (!isValidValueLength(item, 6)) {
      console.log(`~~~~~ validateSNUMBER_LICENSE isValid: FALSE`);

      return false;
    }

    console.log(`~~~~~ validateSNUMBER_LICENSE isValid: TRUE`);
  }

  function validateDINSURED_STAGEDATE(item, data) {
    const insuredList = findField("INSURED_LIST")?.value;
    const DINSURED_STAGEDATE = findFieldInInxuredList(insuredList[0], "DINSURED_STAGEDATE") ;
    const DINSURED_BIRTHDATE = findFieldInInxuredList( insuredList[0],"DINSURED_BIRTHDATE");
    const stageDate = getDate(DINSURED_STAGEDATE.value);
    const birthDate = getDate(DINSURED_BIRTHDATE.value);
    const temp = new Date();
    const currentDate = new Date(temp.getFullYear(), temp.getMonth(), temp.getDate());

    if (!stageDate || !stageDate) {
      console.log(`------ validateDINSURED_STAGEDATE not all dates is set`)
      return;
    }

    if (stageDate <= currentDate && isDatesLatestThenSomeYears(birthDate, stageDate, 16)) {
      console.log(`------ validateDINSURED_STAGEDATE dates is OK`);

      return;
    }

    console.log(`------ validateDINSURED_STAGEDATE dates is NOT OK`);
  }

  function validateForm(data, item) {
    const fieldsValidators = {
      SSERIA_LICENSE: validateSSERIA_LICENSE,
      SNUMBER_LICENSE: validateSNUMBER_LICENSE,
      DINSURED_STAGEDATE: validateDINSURED_STAGEDATE
    };
    const field = getFieldFromItem(item);

    if (fieldsValidators[field.name]) {
      fieldsValidators[field.name](field, data);
    }
  }

  validateForm(data, item);

  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");
  const SHELP_INFO = copyData.find((f) => f.name === "SHELP_INFO");
  const BMULTI = data.find(({ name }) => name === "BMULTI");

  function findField(name) {
    const field = copyData.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${ name } не найдено в данных`);
  }

  function isDatesLatestThenSomeYears(minDate, maxDate, years = 0) {
    const modifyMinDate = (new Date()).setFullYear(minDate.getFullYear() + years);
    const test = maxDate >= modifyMinDate;

    return maxDate >= modifyMinDate;
  }

  function getDate(str) {
    const splitSrt = str?.split(".");

    if (Array.isArray(splitSrt) && splitSrt.length === 3) {
      return new Date(splitSrt.reverse());
    }

    return null;
  }

  function findFieldInInxuredList(list = [], name) {
    return list.find(item => item.name === name);
  }

  function findDeepBasedField(dataSet, name, index) {
    const field = dataSet[index].find((el) => el.name === name);

    if (field !== undefined) {
      return field;
    }
    throw new Error(`Поле ${ name } не найдено в ${ dataSet }`);
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

    if (item.value.value.value === true) {
      previousSecondName.visible = true;
      previousCountry.visible = true;
      previousSeries.visible = true;
      previousNumber.visible = true;
    }

    if (item.value.value.value === false) {
      previousSecondName.visible = false;
      previousCountry.visible = false;
      previousSeries.visible = false;
      previousNumber.visible = false;
    }
  }

  if (BMULTI.value === true) {
    INSURED_LIST.visible = false;
    SHELP_INFO.visible = true;
  } else {
    INSURED_LIST.visible = true;
    SHELP_INFO.visible = false;
  }

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
