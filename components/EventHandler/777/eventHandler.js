async function eventHandler(fields, action, func) {
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

  const citySettlement = findField("SCITY_SETTLEMENT");
  const ownerAge = findField("NOWNER_AGE");
  const empty = findField("Empty");
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
  const labelRegNumb_Number = findField("input_label_Nmber");
  const crash_years = findField("NNO_CRASH_YEARS");
  const calculate_btn = findField("Item36585");
  const captcha = findField(`CAPTCHA`);
  const reg_number_title = findField("z_one");
  const owner_title = findField("z-two");
  const car_title = findField("z-three");
  const drivers_title = findField("z-four");
  const add_driver = findField(`ADD_DRIVER`);

  let autoInfo = null;

  const url = new URL("/free/v2/osago/findAuto", window.location);

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
    calculate_btn,
    reg_number_title,
    owner_title,
    car_title,
    drivers_title,
  ];

  if (isCaptchaNeeded.value === true) {
    checkNotRegNumberForm.push(captcha);
  }

  let checkDriversForm = [crash_years, add_driver];

  if (driverType.value == 1) {
    checkNotRegNumberForm.push(crash_years);
    checkDriversForm = checkDriversForm.concat(
      showDrivers().length ? showDrivers() : findDriver(1)
    );
  }

  if (driverType.value == 2) {
    checkNotRegNumberForm = checkNotRegNumberForm.concat(
      findVisibleDrivers().length
        ? findVisibleDrivers()
        : showDrivers().length
        ? showDrivers()
        : findDriver(1)
    );
    checkNotRegNumberForm.push(add_driver);
    checkDriversForm = checkDriversForm.concat(
      showDrivers().length ? showDrivers() : findDriver(1)
    );
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

  if (action.name === "LCHECKREGNUMBER") {
    if (!regNumber.value || !action.value) {
      invertPropertyElements(checkNotRegNumberForm, "visible");
    }
    regNumber.value = "";
    invertPropertyElements([regNumber], "readonly");
  }

  if (action.value === "SFILLINMANUALLY") {
    checkNotRegNumber.value = true;
  }

  if (action.name === "NDRIVER_TYPE" && action.value === "1") {
    invertPropertyElements(checkDriversForm, "visible");
    changeElements(findVisibleDrivers(), "visible", false);
  }

  if (action.name === "NDRIVER_TYPE" && action.value === "2") {
    invertPropertyElements(checkDriversForm, "visible");
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

  if (action.value === "SCALCULATEPOLIS") {
    function convertRusToRESO(regNumber) {
      const ruLatLetters = {
        А: "A",
        В: "B",
        Е: "E",
        К: "K",
        М: "M",
        Н: "N",
        О: "O",
        Р: "P",
        С: "C",
        Т: "T",
        У: "Y",
        Х: "X",
      };
      let resStr = "";
      regNumber
        .split("")
        .forEach((_, i) =>
          ruLatLetters[regNumber[i]]
            ? (resStr += ruLatLetters[regNumber[i]])
            : (resStr += regNumber[i])
        );
      return resStr;
    }

    async function getInfo(regNumberValue) {
      url.searchParams.set("REG_NUMBER", convertRusToRESO(regNumberValue));
      const response = await fetch(url.href);
      const dataAuto = await response.json();
      return dataAuto;
    }
    if (regNumber.value) {
      autoInfo = regNumber.value ? await getInfo(regNumber.value) : [];
      if (!!autoInfo && autoInfo.length > 0) {
        showLabelFunc(labelRegNumb, labelRegNumb_Number);
        hideErrorFunc(errRegNumNotFound, errRegNumNotFoundMob);
        vehicleModel.value = `${autoInfo[0].BRAND_MODEL_MODIFICATION}|${autoInfo[0].MAKE_MODEL}`;
        yearVehicle.value = autoInfo[0].NBUILD_YEAR;
        horseVehiclePower.value = autoInfo[0].OUTPUT;
        khVeiclePower.value = autoInfo[0].POWER_KVT;
      } else {
        showErrorFunc(errRegNumNotFound, errRegNumNotFoundMob);
        hideLabelFunc(labelRegNumb, labelRegNumb_Number);
        vehicleModel.value = "";
        yearVehicle.value = null;
        horseVehiclePower.value = null;
        khVeiclePower.value = null;
      }
      invertPropertyElements(checkNotRegNumberForm, "visible");
    } else {
      regNumber.state = false;
    }
  }

  /**
   * Расчет мощностей
   */

  const minAgeOwner = 0;
  const maxAgeOwner = 99;
  const minAgeDriver = 18;
  const maxAgeDriver = 99;

  const isValidAge = function ({ age, min, max }) {
    let isValid = false;
    if (age !== undefined && age !== null && age !== "") {
      if (age >= min && age <= max) {
        isValid = true;
      }
    }
    return isValid;
  };

  const isValidExperience = function ({ age, experience }) {
    let isValid = false;
    if (experience !== undefined && experience !== null && experience !== "") {
      if (
        isValidAge({
          age: age,
          min: minAgeDriver,
          max: maxAgeDriver,
        }) === true
      ) {
        if (experience <= age - minAgeDriver) {
          isValid = true;
        }
      } else {
        if (experience <= maxAgeDriver - minAgeDriver) {
          isValid = true;
        }
      }
    }
    return isValid;
  };

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
        } else {
          if (fieldExperience.state !== null) {
            fieldExperience.state = false;
            fieldExperience.error = "Некорректное значение";
          }
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

  if (
    action.name === `NOWNER_AGE` &&
    findField("NDR_AGE_1").visible === true &&
    findField("NDR_AGE_1").value === undefined &&
    findField("NDRIVER_TYPE").value === "2"
  ) {
    const visibleDriversCount = getVisibleDriversCount();

    if (func !== null && action.value >= 18 && func.value < 100) {
      findField("NDR_AGE_1").value = func.value;
      findField("NDR_AGE_1").state = true;
      findField("NDR_AGE_1").checked = true;

      findField("NDR_EXPERIENCE_1").value = func.value - 18;
      findField("NDR_EXPERIENCE_1").state = true;
      findField("NDR_EXPERIENCE_1").checked = true;

      const currentExperience = Number(findField("NDR_EXPERIENCE_1").value);

      if (currentExperience >= 10) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 13
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 9) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 12
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 8) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 11
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 7) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 10
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 6) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 9
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 5) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 8
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 4) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 7
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 3) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 6
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 2) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 5
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 1) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 4
        );
        findField("NDR_NO_CRASH_1").value = result[0].value;
        findField("NDR_NO_CRASH_1").state = true;
        findField("NDR_NO_CRASH_1").checked = true;
      }

      if (currentExperience === 0) {
        const result = findField("NDR_NO_CRASH_1").options.filter(
          (item) => item.value === 3
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

      if (findField(`NDR_AGE_${currentDriverId + 1}`).value) {
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

      if (findField(`NDR_EXPERIENCE_${currentDriverId + 1}`).value) {
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

      if (findField(`NDR_NO_CRASH_${currentDriverId + 1}`).value) {
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

  function getVisibleDriversCount() {
    return fields
      .filter((item) => item.name.includes("NDR_AGE"))
      .filter((item) => item.visible).length;
  }

  function getDriversCount() {
    return fields.filter((item) => item.name.includes("NDR_AGE")).length;
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
  }

  if (action.value === "Item36585") {
    if (findField("SVEHICLE_MODEL").value === undefined) {
      findField("SVEHICLE_MODEL").error = "Марка авто не указана";
    }

    if (findField("NYEAR_VEHICLE").value === undefined) {
      findField("NYEAR_VEHICLE").error = "Заполните год";
    }

    if (findField("NHORSE_VEHICLE_POWER").value === undefined) {
      findField("NHORSE_VEHICLE_POWER").error = "Мощность не указана";
    }

    if (findField("NKH_VEHICLE_POWER").value === undefined) {
      findField("NKH_VEHICLE_POWER").error = "Мощность не указана";
    }
  }

  return fields;
}

export { eventHandler };
