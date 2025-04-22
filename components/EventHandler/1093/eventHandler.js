(() => {
  const prevFields = ['SPREV_SECONDNAME', 'IDCOUNTRY_PREV', 'SPREV_LICSERIA', 'SPREV_LICNUMBER'];

  function findField(dataSet, name) {
    if (!Array.isArray(dataSet)) return {};
    const field = dataSet.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function validateBoolean(value) {
    if (typeof value === "boolean") return value;
    if (["Y", "Д", "true"].includes(value)) return true;
    if (["N", "Н", "false"].includes(value)) return false;
    return false;
  }

  function setVisibleSafety(data, name, value) {
    const field = findField(data, name);
    if (field) {
      field.visible = value;
    }
  }

  function eventHandler(data, item) {
    const copyData = JSON.parse(JSON.stringify(data));
    const INSURED_LIST = copyData.find((f) => f.name === "INSURED_LIST");

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
      const field = INSURED_LIST[item.insuredIndex]?.find(
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
      const list = INSURED_LIST[item.insuredIndex];
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
      if (fieldsBaseState && (!stageDate || !birthDate)) {
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
      return INSURED_LIST?.value.every((list) =>
        list.every((item) => item.visible !== true || item.state !== false)
      );
    }

    /**
     * @description Доступность кнопки далее на форме исходя из валидности формы
     */
    function setNextButtonState() {
      const nextButton = copyData.find((item) => item.name === "Continue");
      const multiDrive = findField(copyData, "BMULTI");

      setVisibleSafety(copyData, 'Continue', isFormValid() || multiDrive?.value)
    }

    function setFieldState(field, state, errMessage) {
      if (field) {
        field.state = state;
        field.error = errMessage;
      }
    }

    const SHELP_INFO = copyData.find((f) => f.name === "SHELP_INFO");
    const BMULTI = copyData.find(({ name }) => name === "BMULTI");

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
      const visible = item?.value?.value?.value === true;
      const dataSet = INSURED_LIST.value[item?.value?.index];

      prevFields.forEach((name) => {
        setVisibleSafety(dataSet, name, visible);
      })
    }

    if (BMULTI?.value === true) {
      setVisibleSafety(copyData, 'INSURED_LIST', false)
      setVisibleSafety(copyData, 'SHELP_INFO', true);
    } else {
      setVisibleSafety(copyData, 'INSURED_LIST', true)
      setVisibleSafety(copyData, 'SHELP_INFO', false);
    }

    validateFormField(item);
    setNextButtonState();

    return copyData;
  }

  function initHandler(data) {
    console.log("init, ", data);

    const INSURED_LIST = findField(data, "INSURED_LIST");

    INSURED_LIST.value.forEach((item, index) => {
      const LPREV_LICENSE = findField(
        INSURED_LIST.value[index],
        "LPREV_LICENSE"
      );
      const lprevChecked = validateBoolean(LPREV_LICENSE.value);
      prevFields.forEach((fieldName) => {
        setVisibleSafety(item, fieldName, lprevChecked);
      });
    });

    return data;
  }
  window.eventHandler = eventHandler;
  window.initHandler = initHandler;
})();
