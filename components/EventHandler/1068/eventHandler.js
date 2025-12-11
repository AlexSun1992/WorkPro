import { scrollToCardHead } from "@/utils/scroll";

export function eventHandler(data, item) {
  const copyData = JSON.parse(JSON.stringify(data));

  const BDRIVER_TYPE = copyData.find((f) => f.name === "BDRIVER_TYPE");
  const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");

  function findDeepBasedField(dataSet, name, index) {
    const field = dataSet[index].find((el) => el.name === name);

    if (field !== undefined) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в ${dataSet}`);
  }

  function valueTransfer(source, target) {
    if (source?.value && !target?.value) {
      target.value = source.value;
      target.state = source.state;
    }
  }

  if (item.action === "update" && item.value.name === "INSURED_LIST") {
    const previousSecondName = findDeepBasedField(INSURED_LIST.value, "SPREV_SECONDNAME", item.value.index);
    const previousFirstName = findDeepBasedField(INSURED_LIST.value, "SPREV_FIRSTNAME", item.value.index);
    const previousThirdName = findDeepBasedField(INSURED_LIST.value, "SPREV_THIRDNAME", item.value.index);
    const previousCountry = findDeepBasedField(INSURED_LIST.value, "IDCOUNTRY_PREV", item.value.index);
    const previousSeries = findDeepBasedField(INSURED_LIST.value, "SPREV_LICSERIA", item.value.index);
    const previousNumber = findDeepBasedField(INSURED_LIST.value, "SPREV_LICNUMBER", item.value.index);
    const previousLicense = findDeepBasedField(INSURED_LIST.value, "LPREV_LICENSE", item.value.index);
    const insuredSecondName = findDeepBasedField(INSURED_LIST.value, "SINSURED_SECONDNAME", item.value.index);
    const insuredFirstName = findDeepBasedField(INSURED_LIST.value, "SINSURED_FIRSTNAME", item.value.index);
    const insuredThirdName = findDeepBasedField(INSURED_LIST.value, "SINSURED_THIRDNAME", item.value.index);
    const insuredIDCountry = findDeepBasedField(INSURED_LIST.value, "IDCOUNTRY", item.value.index);

    if (previousLicense && item.value.value.name === "LPREV_LICENSE") {
      valueTransfer(insuredSecondName, previousSecondName);
      valueTransfer(insuredFirstName, previousFirstName);
      valueTransfer(insuredThirdName, previousThirdName);
      valueTransfer(insuredIDCountry, previousCountry);
    }

    if (item.value.value.value === true) {
      previousSecondName.visible = true;
      previousFirstName.visible = true;
      previousThirdName.visible = true;
      previousCountry.visible = true;
      previousSeries.visible = true;
      previousNumber.visible = true;
    }

    if (item.value.value.value === false) {
      previousSecondName.visible = false;
      previousFirstName.visible = false;
      previousThirdName.visible = false;
      previousCountry.visible = false;
      previousSeries.visible = false;
      previousNumber.visible = false;

      previousSecondName.value = null;
      previousFirstName.value = null;
      previousThirdName.value = null;
      previousCountry.value = null;
      previousSeries.value = null;
      previousNumber.value = null;

      previousSecondName.state = null;
      previousFirstName.state = null;
      previousThirdName.state = null;
      previousCountry.state = null;
      previousSeries.state = null;
      previousNumber.state = null;
    }
  }

  if (BDRIVER_TYPE) {
    if (BDRIVER_TYPE.visible === true) {
      if (BDRIVER_TYPE.value === false) {
        INSURED_LIST.visible = true;
      }
      if (BDRIVER_TYPE.value === true) {
        INSURED_LIST.visible = false;
      }
    }
  }

  return copyData;
}

export function initHandler(data) {
  scrollToCardHead(".wizard_kasko");

  const copyData = data;

  function findField(dataSet, name) {
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const INSURED_LIST = findField(copyData, "INSURED_LIST");
  const BDRIVER_TYPE = findField(copyData, "BDRIVER_TYPE");

  INSURED_LIST.value.forEach((item, index) =>
    item.forEach((el, i) => {
      if (el.name === "LPREV_LICENSE") {
        const LPREV_LICENSE = findField(INSURED_LIST.value[index], "LPREV_LICENSE");
        //console.log('Дороу ' + LPREV_LICENSE.value);

        if (LPREV_LICENSE.value == "Y") {
          LPREV_LICENSE.value = true;
          findField(INSURED_LIST.value[index], "SPREV_SECONDNAME").visible = true;
          findField(INSURED_LIST.value[index], "SPREV_FIRSTNAME").visible = true;
          findField(INSURED_LIST.value[index], "SPREV_THIRDNAME").visible = true;
          findField(INSURED_LIST.value[index], "IDCOUNTRY_PREV").visible = true;
          findField(INSURED_LIST.value[index], "SPREV_LICSERIA").visible = true;
          findField(INSURED_LIST.value[index], "SPREV_LICNUMBER").visible = true;
        }

        if (LPREV_LICENSE.value == "N") {
          LPREV_LICENSE.value = false;
          findField(INSURED_LIST.value[index], "SPREV_SECONDNAME").visible = false;
          findField(INSURED_LIST.value[index], "SPREV_FIRSTNAME").visible = false;
          findField(INSURED_LIST.value[index], "SPREV_THIRDNAME").visible = false;
          findField(INSURED_LIST.value[index], "IDCOUNTRY_PREV").visible = false;
          findField(INSURED_LIST.value[index], "SPREV_LICSERIA").visible = false;
          findField(INSURED_LIST.value[index], "SPREV_LICNUMBER").visible = false;
        }
      }
    })
  );

  if (BDRIVER_TYPE.visible === true) {
    if (BDRIVER_TYPE.value === false) {
      INSURED_LIST.visible = true;
    }

    if (BDRIVER_TYPE.value === true) {
      INSURED_LIST.visible = false;
    }
  }

  return copyData;
}
