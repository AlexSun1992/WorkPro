async function eventHandler(fields, action, func) {
  if (func === "afterSave" && logEventVue) {
    try {
      logEventVue({
        formName: "777",
        idEventType: 1001,
        timeUser: new Date(),
      });
    } catch (e) {
      console.error(e);
    }
  }

  function findVisibleDrivers() {
    const driverFieldNames = [
      `DL_BUTTON_`,
      `NDR_AGE_`,
      `NDR_EXPERIENCE_`,
      `NDR_NO_CRASH_`,
    ];
    return fields.filter((item) =>
      driverFieldNames.find((n) => item.name.indexOf(n) >= 0 && item.visible)
    );
  }

  function findDrivers() {
    const driverFieldNames = [
      `DL_BUTTON_`,
      `NDR_AGE_`,
      `NDR_EXPERIENCE_`,
      `NDR_NO_CRASH_`,
    ];
    return fields.filter((item) =>
      driverFieldNames.find((n) => item.name.indexOf(n) >= 0)
    );
  }

  function getVisibleDriversCount() {
    return fields
      .filter((item) => item.name.includes("NDR_AGE"))
      .filter((item) => item.visible).length;
  }

  function getDriversCount() {
    return fields.filter((item) => item.name.includes("NDR_AGE")).length;
  }

  /**
   * Поиск полей водителя
   * @param {number} driverId
   * @returns { import("./configurator.service.55-777.types").Field777[] }
   */

  function findDriver(driverId) {
    const driverFieldNames = [
      `DL_BUTTON_${driverId}`,
      `NDR_AGE_${driverId}`,
      `NDR_EXPERIENCE_${driverId}`,
      `NDR_NO_CRASH_${driverId}`,
    ];
    return fields.filter((item) => driverFieldNames.includes(item.name));
  }

  function showDrivers() {
    const driverFieldNames = [
      `DL_BUTTON_`,
      `NDR_AGE_`,
      `NDR_EXPERIENCE_`,
      `NDR_NO_CRASH_`,
    ];
    let drivers = [];
    fields
      .filter((item) =>
        driverFieldNames.find((n) => item.name.indexOf(n) >= 0 && item.value)
      )
      .forEach((i) => {
        drivers = [
          ...new Set(
            drivers.concat(
              findDriver(
                i.name.split(
                  driverFieldNames.find((n) => i.name.indexOf(n) >= 0)
                )[1]
              )
            )
          ),
        ];
      });
    return drivers;
  }

  function findField(name) {
    const field = fields.find((item) => item.name === name);
    if (field) {
      return field;
    }

    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const changeElements = ([...params], property, value) => {
    params.forEach((el) => {
      el[property] = value;
    });
  };

  const invertPropertyElements = ([...params], property) => {
    params.forEach((el) => {
      el[property] = !el[property];
    });
  };

  const reVisibleDrivers = ([...drivers]) => {
    const driverFieldNames = [
      `DL_BUTTON_`,
      `NDR_AGE_`,
      `NDR_EXPERIENCE_`,
      `NDR_NO_CRASH_`,
    ];
    const lastDriver = drivers[drivers.length - 1];
    const lastDriverId = lastDriver.name.replace("DL_BUTTON_", "");
    const newDrivers = findDrivers().filter(
      (item) =>
        item.name.split(
          driverFieldNames.find(
            (n) => item.name.indexOf(n) >= 0 && item.type !== "empty"
          )
        )[1] <= lastDriverId
    );
    return newDrivers;
  };

  const citySettlement = findField("SCITY_SETTLEMENT");
  const ownerAge = findField("NOWNER_AGE");
  const empty = findField("Empty1");
  const vehicleModel = findField("SVEHICLE_MODEL");
  const yearVehicle = findField("NYEAR_VEHICLE");
  const horseVehiclePower = findField("NHORSE_VEHICLE_POWER");
  const khVeiclePower = findField("NKH_VEHICLE_POWER");
  const driverType = findField("NDRIVER_TYPE");
  const emptyField1 = findField("EMPTY_FIELD_1");
  const empryThree = findField("empty");
  const emptyField3 = findField("EMPTY_FIELD_3");
  const fillInmanually = findField("SFILLINMANUALLY");
  const checkNotRegNumber = findField("LCHECKREGNUMBER");
  const calculatePolis = findField("SCALCULATEPOLIS");
  const regNumber = findField("SREGNUMBER");
  const isCaptchaNeeded = findField("BISCAPTCHANEEDED");
  const errRegNumNotFound = findField("input_label_err_regnum_not_fou");
  const errRegNumNotFoundMob = findField("input_label_Nmber_err_N_F");
  const labelRegNumb = findField("input_label");
  const labelRegNumber = findField("input_label_Nmber");
  const crashYears = findField("NNO_CRASH_YEARS");
  const calculateBtn = findField("Item36585");
  const captcha = findField(`SRECAPTCHA`);
  const regTumberTitle = findField("z_one");
  const ownerTitle = findField("z-two");
  const carTitle = findField("z-three");
  const driversTitle = findField("z-four");
  const addDriver = findField(`ADD_DRIVER`);
  const emptyFive = findField("empty-5");
  const price = findField("NPRICE");

  let autoInfo = null;

  let checkNotRegNumberForm = [
    citySettlement,
    ownerAge,
    empty,
    vehicleModel,
    yearVehicle,
    horseVehiclePower,
    khVeiclePower,
    empty,
    driverType,
    emptyField1,
    empryThree,
    emptyField3,
    fillInmanually,
    calculatePolis,
    calculateBtn,
    ownerTitle,
    carTitle,
    driversTitle,
    emptyFive,
  ];

  if (isCaptchaNeeded.value === true) {
    //  debugger;
    // checkNotRegNumberForm.push(captcha);
  }
  if (price.visible) {
    checkNotRegNumberForm.push(price);
  }

  regNumber.readonly = Boolean(checkNotRegNumber.value);

  let checkDriversForm = [crashYears, addDriver];

  if (driverType.value == 1) {
    checkNotRegNumberForm.push(crashYears);
    checkDriversForm = checkDriversForm.concat(
      showDrivers().length ? showDrivers() : findDriver(1)
    );
  }
  const drivers = findVisibleDrivers().length
    ? findVisibleDrivers()
    : showDrivers().length
    ? reVisibleDrivers(showDrivers())
    : findDriver(1);

  if (driverType.value == 2) {
    checkNotRegNumberForm = checkNotRegNumberForm.concat(drivers);
    checkNotRegNumberForm.push(addDriver);
    checkDriversForm = checkDriversForm.concat(drivers);

    if (drivers.length === 4) {
      const delDriversFormButtonIndex = checkDriversForm.findIndex(
        (item) => item.name.indexOf("DL_BUTTON_1") >= 0
      );
      const delRegNumberFormButtonIndex = checkNotRegNumberForm.findIndex(
        (item) => item.name.indexOf("DL_BUTTON_1") >= 0
      );

      if (delDriversFormButtonIndex > 0 && delRegNumberFormButtonIndex > 0) {
        if (checkDriversForm.length === 6) {
          checkDriversForm.splice(delDriversFormButtonIndex, 1);
          checkNotRegNumberForm.splice(delRegNumberFormButtonIndex, 1);
          checkDriversForm.push(findField("empty_DL_BUTTON_1"));
          checkNotRegNumberForm.push(findField("empty_DL_BUTTON_1"));
        }
      }
    }
  }

  if (action.name === "LCHECKREGNUMBER") {
    if (!vehicleModel.visible) {
      regNumber.value = "";
      regNumber.error = null;
      errRegNumNotFoundMob.visible = false;
    }
    if (!regNumber.value) {
      findField("SCALCULATEPOLIS").readonly = true;
    }
    if (!regNumber.value || !action.value) {
      invertPropertyElements(checkNotRegNumberForm, "visible");
      // Фикс бага с некорректным токеном recaptcha
      if (isCaptchaNeeded.value === true) {
        captcha.visible = true;
      }
    }
    if (!action.value) {
      calculateBtn.visible = false;
      // captcha.visible = false;
    }
    if (drivers.length === 20) {
      addDriver.visible = false;
    }
  }

  if (action.value === "SFILLINMANUALLY") {
    if (regNumber.value) {
      invertPropertyElements(checkNotRegNumberForm, "visible");
    } else {
      checkNotRegNumber.value = true;
    }
  }

  if (action.name === "NDRIVER_TYPE" && action.value === "1") {
    invertPropertyElements(checkDriversForm, "visible");
    changeElements(findVisibleDrivers(), "visible", false);
    addDriver.visible = false;
  }

  if (action.name === "NDRIVER_TYPE" && action.value === "2") {
    invertPropertyElements(checkDriversForm, "visible");
    if (drivers.length === 20) {
      addDriver.visible = false;
    }
  }

  const showErrorFunc = (...params) => {
    params.forEach((el) => (el.visible = true));
  };

  const showLabelFunc = (...params) => {
    params.forEach((el) => (el.visible = true));
  };

  const hideLabelFunc = (...params) => {
    params.forEach((el) => (el.visible = false));
  };

  const hideErrorFunc = (...params) => {
    params.forEach((el) => (el.visible = false));
  };

  function convertRusToRESO(regNumberString) {
    const ruLatLetters = {
      А: "A",
      В: "B",
      Е: "E",
      К: "K",
      М: "M",
      Н: "H",
      О: "O",
      Р: "P",
      С: "C",
      Т: "T",
      У: "Y",
      Х: "X",
    };
    let resStr = "";
    regNumberString.split("").forEach((_, i) => {
      if (ruLatLetters[regNumberString[i]]) {
        resStr += ruLatLetters[regNumberString[i]];
      } else {
        resStr += regNumberString[i];
      }
    });
    return resStr;
  }

  async function getInfo(regNumberValue) {
    const url = new URL("/am/free/v2/osago/findAuto", window.location);
    url.searchParams.set("REG_NUMBER", convertRusToRESO(regNumberValue));
    const dataAuto = await func(url.href);
    return dataAuto;
  }

  async function getInfoAuth(regNumberValue) {
    const url = new URL("/am/main/v2/osago/findAuto", window.location);
    url.searchParams.set("REG_NUMBER", convertRusToRESO(regNumberValue));
    const dataAuto = await func(url.href);
    return dataAuto;
  }

  if (action.value === "SCALCULATEPOLIS") {
    if (regNumber.value) {
      autoInfo =
        (await getInfoAuth(regNumber.value)) ||
        (await getInfo(regNumber.value));
      if (!!autoInfo && autoInfo.length > 0) {
        showLabelFunc(labelRegNumb, labelRegNumber);
        hideErrorFunc(errRegNumNotFound, errRegNumNotFoundMob);
        vehicleModel.value = `${autoInfo[0].BRAND_MODEL_MODIFICATION}|${autoInfo[0].MAKE_MODEL}`;
        vehicleModel.state = true;
        vehicleModel.error = null;
        yearVehicle.value = autoInfo[0].NBUILD_YEAR;
        yearVehicle.state = true;
        yearVehicle.error = null;
        horseVehiclePower.value = autoInfo[0].OUTPUT;
        horseVehiclePower.state = true;
        horseVehiclePower.error = null;
        khVeiclePower.value = autoInfo[0].POWER_KVT;
        khVeiclePower.state = true;
        khVeiclePower.error = null;
        ownerAge.value = autoInfo[0].NOWNER_AGE;
        if (ownerAge.value) {
          ownerAge.state = true;
          ownerAge.error = null;
        }
      } else {
        showErrorFunc(errRegNumNotFound, errRegNumNotFoundMob);
        hideLabelFunc(labelRegNumb, labelRegNumber);
        vehicleModel.value = "";
        vehicleModel.state = null;
        yearVehicle.value = null;
        yearVehicle.state = null;
        horseVehiclePower.value = null;
        horseVehiclePower.state = null;
        khVeiclePower.value = null;
        khVeiclePower.state = null;
      }
      invertPropertyElements(checkNotRegNumberForm, "visible");
    } else {
      regNumber.state = false;
    }
  }

  /// Дизэйбл и очищение поля RegNumber по нажатию checkbox при наличии ошибки "Госномера еще нет"

  if (
    action.name === "LCHECKREGNUMBER" &&
    errRegNumNotFoundMob.visible === true
  ) {
    regNumber.readonly = true;
    regNumber.value = "";
    hideErrorFunc(errRegNumNotFoundMob);
  }

  if (action.name === "SREGNUMBER") {
    if (action.state === null || action.state === false) {
      findField("SCALCULATEPOLIS").readonly = true;
    } else {
      findField("SCALCULATEPOLIS").readonly = false;
    }
  }

  // Скрытие сообщения о госномере и сброс до исходного состояния
  if (action.name === "SREGNUMBER" && errRegNumNotFoundMob.visible === true) {
    hideErrorFunc(errRegNumNotFoundMob);
    invertPropertyElements(checkNotRegNumberForm, "visible");
  }

  // Возвращение формы к исходному состоянию при изменении regNumber при правильном regNumber
  if (action.name === "SREGNUMBER" && vehicleModel.visible === true) {
    invertPropertyElements(checkNotRegNumberForm, "visible");
    findField(`Item36585`).visible = false;
  }

  /**
   * Расчет мощностей
   */

  const minAgeOwner = 0;
  const maxAgeOwner = 99;
  const minAgeDriver = 18;
  const maxAgeDriver = 99;

  function isValidAge({ age, min, max }) {
    let isValid = false;
    if (age !== undefined && age !== null && age !== "") {
      if (age >= min && age <= max) {
        isValid = true;
      }
    }
    return isValid;
  }

  function isValidExperience({ age, experience }) {
    let isValid = false;
    if (experience !== undefined && experience !== null && experience !== "") {
      if (
        isValidAge({
          age,
          min: minAgeDriver,
          max: maxAgeDriver,
        }) === true
      ) {
        if (experience <= age - minAgeDriver) {
          isValid = true;
        }
      } else if (experience <= maxAgeDriver - minAgeDriver) {
        isValid = true;
      }
    }
    return isValid;
  }

  function setFields({ fieldName }) {
    const field = fields.find((f) => f.name === fieldName);
    const lastSymbol = fieldName[fieldName.length - 1];

    // проверка для возраста собственника
    if (fieldName === "NOWNER_AGE") {
      if (
        isValidAge({ age: field.value, min: minAgeOwner, max: maxAgeOwner })
      ) {
        field.state = true;
        delete field.error;
      } else {
        field.state = false;
        field.error = "Некорректное значение";
      }
    }
    // проверка возраста водителя
    if (fieldName.startsWith("NDR_AGE_")) {
      const fieldExperience = fields.find(
        (f) => f.name === `NDR_EXPERIENCE_${lastSymbol}`
      );
      field.state = false;
      field.error = "Некорректное значение";
      if (
        isValidAge({
          age: field.value,
          min: minAgeDriver,
          max: maxAgeDriver,
        }) === true
      ) {
        field.state = true;
        delete field.error;
        if (
          isValidExperience({
            age: field.value,
            experience: fieldExperience.value,
          }) === true
        ) {
          fieldExperience.state = true;
          delete fieldExperience.error;
        } else if (fieldExperience.state !== null) {
          fieldExperience.state = false;
          fieldExperience.error = "Некорректное значение";
        }
      }
    }
    // проверка валидности стажа
    if (fieldName.startsWith("NDR_EXPERIENCE_")) {
      const fieldAge = fields.find((f) => f.name === `NDR_AGE_${lastSymbol}`);
      field.state = false;
      field.error = "Некорректное значение";
      if (
        isValidExperience({ experience: field.value, age: fieldAge.value }) ===
        true
      ) {
        field.state = true;
        delete field.error;
      }
    }

    // валидация полей мощности
    // лошадинные силы
    if (fieldName === "NHORSE_VEHICLE_POWER") {
      const fieldNHORSE = fields.find((f) => f.name === fieldName);

      // условие если пользователь ввел число больше 999
      if (action.value > 999) {
        fieldNHORSE.state = false;
        fieldNHORSE.error = "Значение должно быть от 1 до 999";
        // условие если пользователь ввел 0
      } else if (action.value < 1) {
        const fieldNKH = fields.find((f) => f.name === "NKH_VEHICLE_POWER");
        fieldNKH.value = null;
        if (fieldNHORSE.state !== null) {
          fieldNKH.state = null;
          fieldNKH.error = "Некорректное значение";
        }
        fieldNHORSE.state = false;
        fieldNHORSE.error = "Значение должно быть от 1 до 999";
      } else if (!field.value) {
        fieldNHORSE.state = false;
      } else {
        const fieldNKH = fields.find((f) => f.name === "NKH_VEHICLE_POWER");
        fieldNKH.value =
          Math.round((Number(action.value) * 100) / 1.3596) / 100;
        fieldNKH.state = true;
        delete fieldNKH.error;
        fieldNHORSE.state = true;
        delete fieldNHORSE.error;
      }
    }

    // КВТ
    if (fieldName === "NKH_VEHICLE_POWER") {
      const fieldNKH = fields.find((f) => f.name === fieldName);

      // условие если пользователь ввел число больше 734.77
      if (action.value > 734.77) {
        fieldNKH.state = false;
        fieldNKH.error = "Значение должно быть от 1 до 734.77";
        // условие если пользователь ввел 0
      } else if (action.value < 1) {
        const fieldNHORSE = fields.find(
          (f) => f.name === "NHORSE_VEHICLE_POWER"
        );
        fieldNHORSE.value = null;
        if (fieldNKH.state !== null) {
          fieldNHORSE.state = null;
          fieldNHORSE.error = "Некорректное значение";
        }
        fieldNKH.state = false;
        fieldNKH.error = "Значение должно быть от 1 до 734.77";
      } else if (!field.value) {
        fieldNKH.state = false;
      } else {
        const fieldNHORSE = fields.find(
          (f) => f.name === "NHORSE_VEHICLE_POWER"
        );
        fieldNHORSE.value =
          Math.round(Number(action.value) * 100 * 1.3596) / 100;
        fieldNHORSE.state = true;
        delete fieldNHORSE.error;
        fieldNKH.state = true;
        delete fieldNKH.error;
      }
    }
  }

  if (action.name !== undefined) {
    setFields({ fieldName: action.name });
  }

  if (
    action.name === `NOWNER_AGE` &&
    findField("NDR_AGE_1").visible === true &&
    findField("NDR_AGE_1").value === undefined &&
    findField("NDRIVER_TYPE").value == "2"
  ) {
    if (
      func !== null &&
      typeof func !== "function" &&
      action.value >= 18 &&
      action.value < 100
    ) {
      findField("NDR_AGE_1").value = action.value;
      findField("NDR_AGE_1").state = true;
      findField("NDR_AGE_1").checked = true;

      findField("NDR_EXPERIENCE_1").value = action.value - 18;
      findField("NDR_EXPERIENCE_1").state = true;
      findField("NDR_EXPERIENCE_1").checked = true;

      const currentExperience = Number(findField("NDR_EXPERIENCE_1").value);

      if (currentExperience >= 10) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "13"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 9) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "12"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 8) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "11"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 7) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "10"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 6) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "9"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 5) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "8"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 4) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "7"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 3) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "6"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 2) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "5"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 1) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "4"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 0) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.SCLASS === "3"
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }
    }
  }

  function deleteDriver(driverId) {
    let currentDriverId = driverId;

    while (true) {
      const nextVisibleDriver = findDriver(currentDriverId + 1).filter(
        (item) => item.visible
      );

      if (nextVisibleDriver.length === 0) {
        findDriver(currentDriverId).forEach((item) => {
          delete item.value;

          item.visible = false;

          item.checked = false;

          item.state = null;
        });

        break;
      }

      if ("value" in findField(`NDR_AGE_${currentDriverId + 1}`)) {
        findField(`NDR_AGE_${currentDriverId}`).value = findField(
          `NDR_AGE_${currentDriverId + 1}`
        ).value;
        findField(`NDR_AGE_${currentDriverId}`).state = findField(
          `NDR_AGE_${currentDriverId + 1}`
        ).state;
        findField(`NDR_AGE_${currentDriverId}`).error = findField(
          `NDR_AGE_${currentDriverId + 1}`
        ).error;
      } else {
        delete findField(`NDR_AGE_${currentDriverId}`).value;
        findField(`NDR_AGE_${currentDriverId}`).state = null;
        findField(`NDR_AGE_${currentDriverId}`).checked = null;
      }

      if ("value" in findField(`NDR_EXPERIENCE_${currentDriverId + 1}`)) {
        findField(`NDR_EXPERIENCE_${currentDriverId}`).value = findField(
          `NDR_EXPERIENCE_${currentDriverId + 1}`
        ).value;
        findField(`NDR_EXPERIENCE_${currentDriverId}`).state = findField(
          `NDR_EXPERIENCE_${currentDriverId + 1}`
        ).state;
        findField(`NDR_EXPERIENCE_${currentDriverId}`).error = findField(
          `NDR_EXPERIENCE_${currentDriverId + 1}`
        ).error;
      } else {
        delete findField(`NDR_EXPERIENCE_${currentDriverId}`).value;
        findField(`NDR_EXPERIENCE_${currentDriverId}`).state = null;
        findField(`NDR_EXPERIENCE_${currentDriverId}`).checked = null;
      }

      if ("value" in findField(`NDR_NO_CRASH_${currentDriverId + 1}`)) {
        findField(`NDR_NO_CRASH_${currentDriverId}`).value = findField(
          `NDR_NO_CRASH_${currentDriverId + 1}`
        ).value;
        findField(`NDR_NO_CRASH_${currentDriverId}`).state = findField(
          `NDR_NO_CRASH_${currentDriverId + 1}`
        ).state;
        findField(`NDR_NO_CRASH_${currentDriverId}`).error = findField(
          `NDR_NO_CRASH_${currentDriverId + 1}`
        ).error;
      } else {
        delete findField(`NDR_NO_CRASH_${currentDriverId}`).value;
        findField(`NDR_NO_CRASH_${currentDriverId}`).state = null;
        findField(`NDR_NO_CRASH_${currentDriverId}`).checked = null;
      }

      currentDriverId += 1;
    }
  }

  function showDriver(driverId) {
    findDriver(driverId).forEach((item) => {
      item.visible = true;
    });
  }

  if ("action" in action) {
    if (action.value === "ADD_DRIVER") {
      const visibleDriversCount = getVisibleDriversCount();

      if (visibleDriversCount === 1) {
        findField("DL_BUTTON_1").visible = true;
        findField("empty_DL_BUTTON_1").visible = false;
      }

      showDriver(visibleDriversCount + 1);

      if (visibleDriversCount === 0) {
        findField(`NDRIVER_TYPE`).value = "2";
      }

      if (visibleDriversCount + 1 >= getDriversCount()) {
        findField(`ADD_DRIVER`).visible = false;
      }
    }

    if (action.value.includes("DL_BUTTON_")) {
      const visibleDriversCount = fields
        .filter((item) => item.name.includes("NDR_AGE"))
        .filter((item) => item.visible).length;

      if (visibleDriversCount < 3) {
        findField("DL_BUTTON_1").visible = false;
        findField("empty_DL_BUTTON_1").visible = true;
      }

      if (visibleDriversCount - 1 <= getDriversCount()) {
        findField(`ADD_DRIVER`).visible = true;
      }

      const deletedDriverId = Number(action.value.replace("DL_BUTTON_", ""));

      deleteDriver(deletedDriverId);
    }
  }

  // Повторный расчёт
  if (
    findField(`NPRICE`).visible === true &&
    action.value !== "Item36585" &&
    action.name !== "LCHECKREGNUMBER"
  ) {
    findField(`Item36585`).visible = true;
    findField(`NPRICE`).visible = false;
    findField(`ISSUE_POLICY`).visible = false;
    if (isCaptchaNeeded.value === true) {
      captcha.visible = true;
    }
  }

  if (action.name === "SVEHICLE_MODEL" && action.value === null) {
    findField("SVEHICLE_MODEL").error = "Марка авто не указана";
  }

  if (action.name === "SVEHICLE_MODEL" && action.value !== null) {
    findField("SVEHICLE_MODEL").error = null;
    findField("SVEHICLE_MODEL").state = true;
  }

  if (action.name === "NYEAR_VEHICLE" && action.value === null) {
    findField("NYEAR_VEHICLE").error = "Заполните год";
  }

  if (action.name === "NYEAR_VEHICLE" && action.value === undefined) {
    findField("NYEAR_VEHICLE").error = "Заполните год";
  }

  if (
    action.name === "NYEAR_VEHICLE" &&
    action.value !== null &&
    action.value !== undefined
  ) {
    findField("NYEAR_VEHICLE").error = null;
    findField("NYEAR_VEHICLE").state = true;
  }

  if (action.name === "NKH_VEHICLE_POWER" && action.value === undefined) {
    findField("NKH_VEHICLE_POWER").error = "Мощность не указана";
  }

  if (action.name === "NHORSE_VEHICLE_POWER" && action.value === undefined) {
    findField("NHORSE_VEHICLE_POWER").error = "Мощность не указана";
  }

  // Обработка по "Рассчитать ОСАГО"

  if (action.value === "Item36585") {
    if (findField("SVEHICLE_MODEL").value === undefined) {
      findField("SVEHICLE_MODEL").error = "Марка авто не указана";
    }
    if (findField("SVEHICLE_MODEL").value !== undefined) {
      findField("SVEHICLE_MODEL").error = null;
    }

    if (findField("NYEAR_VEHICLE").value === undefined) {
      findField("NYEAR_VEHICLE").error = "Заполните год";
    }
    if (findField("NYEAR_VEHICLE").value !== undefined) {
      findField("NYEAR_VEHICLE").error = null;
    }

    if (findField("NHORSE_VEHICLE_POWER").value === undefined) {
      findField("NHORSE_VEHICLE_POWER").error = "Мощность не указана";
    }

    if (findField("NKH_VEHICLE_POWER").value === undefined) {
      findField("NKH_VEHICLE_POWER").error = "Мощность не указана";
    }

    if (func == "beforeSave") {
      try {
        /*
         logEventVue({
           formName: '777',
           idEventType: 1000,
           controlName: findField(`Item36585`).webId,
           timeUser: new Date()
         });
         */
      } catch (e) {
        console.error(e);
      }
      try {
        if (window.navigator.vibrate) {
          window.navigator.vibrate([200, 100, 200]);
          console.log(new Date(), "vibrate");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  crashYears.visible = false;
  return fields;
}
export { eventHandler };
