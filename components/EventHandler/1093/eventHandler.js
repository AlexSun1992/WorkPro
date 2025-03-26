async function eventHandler(data, item, callback) {
  const copyData = JSON.parse(JSON.stringify(data));

  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");
  const SHELP_INFO = copyData.find((f) => f.name === "SHELP_INFO");
  const BMULTI = data.find(({ name }) => name === "BMULTI");

  function findField(name) {
    const field = copyData.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function findDeepBasedField(dataSet, name, index) {
    const field = dataSet[index].find((el) => el.name === name);

    if (field !== undefined) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в ${dataSet}`);
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
    console.log(previousLicense.value);

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
  console.log(JSON.stringify(data));

  function findField(dataSet, name) {
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

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
