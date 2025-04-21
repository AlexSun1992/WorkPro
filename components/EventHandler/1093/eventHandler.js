(() => {
  function findField(dataSet, name) {
    console.log(dataSet, Array.isArray(dataSet), name);
    if (!Array.isArray(dataSet)) return {};
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function validateBoolean(value) {
    if (!value) return false;
    if (typeof value === "boolean") return value;

    if (["Y", "Д", "true"].includes(value)) {
      return true;
    }
    if (["N", "Н", "false"].includes(value)) {
      return false;
    }
  }

  function setVisibleSafety(data, name, value) {
    console.log(data, name, 'safety')
    const field = findField(data, name);
    if (field) {
      console.log(field);
      field.visible = value;
    }
    console.log('setVisibleSafety, end');
  }

  function eventHandler(data, item, callback) {
    console.log(item.name, item.value, item);

    function getFieldFromItem(item) {
      const result = { ...item?.value?.value };
      result.insuredIndex = item?.value?.index;

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
      const insuredList = findField(data, "INSURED_LIST")?.value;
      const field = insuredList[item.insuredIndex]?.find(
        (field) => field.name === item.name
      );

      const isValidValueLength = item.value?.length === length;

      if ("value" in item && !isValidValueLength) {
        if (length < 5) {
          setFieldState(field, false, `Должно быть введено ${length} символа`);
        } else {
          setFieldState(field, false, `Должно быть введено ${length} символов`);
        }
        return;
      }

      setFieldState(field, true, null);
    }

    function validateDates(item) {
      const insuredList = findField(data, "INSURED_LIST")?.value;
      const list = insuredList[item.insuredIndex];
      const DINSURED_STAGEDATE = findFieldInInsuredList(
        list,
        "DINSURED_STAGEDATE"
      );
      const DINSURED_BIRTHDATE = findFieldInInsuredList(
        list,
        "DINSURED_BIRTHDATE"
      );
      const stageDate = getDate(DINSURED_STAGEDATE.value);
      const birthDate = getDate(DINSURED_BIRTHDATE.value);
      const temp = new Date();
      const currentDate = new Date(
        temp.getFullYear(),
        temp.getMonth(),
        temp.getDate()
      );
      let fieldsBaseState = true;

      if (!stageDate && DINSURED_STAGEDATE.required) {
        setFieldState(
          DINSURED_STAGEDATE,
          false,
          "Поле обязательно к заполнению"
        );

        fieldsBaseState = false;
      }
      if (!birthDate && DINSURED_BIRTHDATE.required) {
        setFieldState(
          DINSURED_BIRTHDATE,
          false,
          "Поле обязательно к заполнению"
        );

        fieldsBaseState = false;
      }
      if (stageDate && currentDate < stageDate) {
        setFieldState(
          DINSURED_STAGEDATE,
          false,
          "Дата начала стажа не может быть позже текущей даты"
        );

        fieldsBaseState = false;
      }
      if (birthDate && currentDate < birthDate) {
        setFieldState(
          DINSURED_BIRTHDATE,
          false,
          "Дата рождения не может быть позже текущей даты"
        );

        fieldsBaseState = false;
      }
      if (!fieldsBaseState) {
      } else if (!stageDate || !birthDate) {
        setFieldState(DINSURED_STAGEDATE, true, null);
        setFieldState(DINSURED_BIRTHDATE, true, null);
      } else if (!isDatesLatestThenSomeYears(birthDate, stageDate, 16)) {
        setFieldState(
          DINSURED_STAGEDATE,
          false,
          "Дата начала стажа не может быть раньше 16 лет"
        );
      } else {
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
        DINSURED_STAGEDATE: validateDates,
        DINSURED_BIRTHDATE: validateDates,
      };
      const field = getFieldFromItem(item);

      if (fieldsValidators[field?.name]) {
        fieldsValidators[field.name](field);
      }
    }

    function isFormValid() {
      const insuredList = findField(data, "INSURED_LIST")?.value;

      return !insuredList?.some((list) =>
        list.some((item) => item.visible === true && item.state === false)
      );
    }

    /**
     * @description Доступность кнопки далее на форме исходя из валидности формы
     */
    function setNextButtonState() {
      const nextButton = data.find((item) => item.name === "Continue");
      const multiDrive = findField(data, "BMULTI");

      setVisibleSafety(nextButton, isFormValid() || multiDrive?.value)
    }

    function setFieldState(field, state, errMessage) {
      if (field) {
        field.state = state;
        field.error = errMessage;
      }
    }

    const INSURED_LIST = data.find((f) => f.name === "INSURED_LIST");
    const SHELP_INFO = data.find((f) => f.name === "SHELP_INFO");
    const BMULTI = data.find(({ name }) => name === "BMULTI");

    function isDatesLatestThenSomeYears(minDate, maxDate, years = 0) {
      const modifyMinDate = minDate.setFullYear(minDate.getFullYear() + years);

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
      return list?.find((item) => item.name === name);
    }

    if (item.value?.name === "INSURED_LIST") {
      console.log('111111111111', INSURED_LIST.value[item?.value?.index])
      setVisibleSafety(INSURED_LIST.value[item?.value?.index], 'SPREV_SECONDNAME', item?.value?.value?.value === true);
      setVisibleSafety(INSURED_LIST.value[item?.value?.index], 'IDCOUNTRY_PREV', item?.value?.value?.value === true);
      setVisibleSafety(INSURED_LIST.value[item?.value?.index], 'SPREV_LICSERIA', item?.value?.value?.value === true);
      setVisibleSafety(INSURED_LIST.value[item?.value?.index], 'SPREV_LICNUMBER', item?.value?.value?.value === true);
    }


    console.log(INSURED_LIST, '*')
    if (BMULTI?.value === true) {
      setVisibleSafety(data, 'INSURED_LIST', false)
      setVisibleSafety(SHELP_INFO, 'SHELP_INFO', true);
    } else {
      setVisibleSafety(data, 'INSURED_LIST', true)
      setVisibleSafety(SHELP_INFO, 'SHELP_INFO', false);
    }

    validateFormField(item);

    return data;
  }

  function initHandler(data) {
    console.log("init, ", data);

    const INSURED_LIST = findField(data, "INSURED_LIST");

    INSURED_LIST.value.forEach((item, index) =>
      item.forEach((el, i) => {
        if (el.name === "LPREV_LICENSE") {
          const LPREV_LICENSE = findField(
            INSURED_LIST.value[index],
            "LPREV_LICENSE"
          );

          const lprevChecked = validateBoolean(LPREV_LICENSE.value);
          setVisibleSafety(INSURED_LIST.value[index], 'SPREV_SECONDNAME', lprevChecked);
          setVisibleSafety(INSURED_LIST.value[index], 'IDCOUNTRY_PREV', lprevChecked);
          setVisibleSafety(INSURED_LIST.value[index], 'SPREV_LICSERIA', lprevChecked);
          setVisibleSafety(INSURED_LIST.value[index], 'SPREV_LICSERIA', lprevChecked);
        }
      })
    );

    return data;
  }
  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
