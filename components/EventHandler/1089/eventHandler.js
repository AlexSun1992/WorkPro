async function eventHandler(data, item, callback) {
  console.log("eventHandler", data, item);
  // eventHandler.test = eventHandler.test ?? []

  if (data.length === 0) {
    return;
  }

  function findField(name) {
    const field = data.find((item) => item.name === name);
    if (field) {
      return field;
    }
    throw new Error(`Поле ${name} не найдено в данных`);
  }

  function setVisibleByPage(page, visible = true) {
    data.forEach((item) => {
      if (item.page === page) {
        item.visible = visible;
        item.readonly = false;
      }
    });
  }

  function isFilledByPage(page) {
    const filtered = data.filter(
      (item) =>
        item.page === page &&
        item.visible === true &&
        item.required === true &&
        item.name !== "DATA_VEHICLE" &&
        item.name !== "BNO_VIN" &&
        item.name !== "BUSED_TRAILER"
    );

    if (filtered.length === 0) {
      return false;
    }

    return filtered.every((item) => item.state === true);
  }

  function isVisibleFieldsState(page) {
    const filtered = data.filter(
      (item) =>
        item.page === page && item.visible === true && item.required === true
    );

    if (filtered.length === 0) {
      return false;
    }

    return filtered.every((item) => item.state === true);
  }

  function revealPage(page) {
    const filtered = data.filter((item) => {
      item.page === page && item.visible === true;
    });
    return filtered.every((item) => item.page === page);
  }

  function revealFieldVisibilityReverseMode(page, visibleFields) {
    console.log("visibleFields:", visibleFields);
    const isAnyFieldsExeptVisible = data.some(
      (item) =>
        !visibleFields.includes(item.name) &&
        item.visible === true &&
        item.page === page
    );

    return isAnyFieldsExeptVisible;
  }

  function setReverseVisibleForSomeFieldsOnCurPage(
    data,
    someFields,
    pageNumber,
    visibility
  ) {
    data.forEach((item) => {
      if (item.page === pageNumber) {
        if (someFields.includes(item.name)) {
          item.visible = visibility;
        }
        if (!someFields.includes(item.name)) {
          item.visible = !visibility;
        }
      }
    });
  }

  function setIncludesFieldsVisibility(
    data,
    someFields,
    pageNumber,
    visibility
  ) {
    data.forEach((item) => {
      if (item.page === pageNumber) {
        if (someFields.includes(item.name)) {
          item.visible = visibility;
        }
      }
    });
  }

  function setExcludeFieldsVisibility(
    data,
    someFields,
    pageNumber,
    visibility
  ) {
    data.forEach((item) => {
      if (item.page === pageNumber) {
        if (!someFields.includes(item.name)) {
          item.visible = visibility;
        }
      }
    });
  }

  const IDCOUNTRYDOC = findField("IDPHOLDER_COUNTRY");
  const IDDOCTYPE = findField("IDPHOLDER_DOCTYPE");
  const BUTTON_NEXT = findField("BUTTON_NEXT");
  const button_nextToPolicy = findField("BUTTON_NEXT_POLICYHOLDER");
  // const BUTTON_BACK = findField("BUTTON_BACK");
  const svin = findField("SVIN");
  const sModel = findField("SMODEL");
  const model = findField("IDMODEL");
  const IDBRAND = findField("IDBRAND");
  const IDMODEL = findField("IDMODEL");
  const BNO_VIN = findField("BNO_VIN");
  const INFO_TS = findField("INFO_TS");
  const saveBtn = findField("Save");
  const regNum = findField("SREGNUM");
  // const chips = findField("IDVEHICLE_POLICY");

  // const SREG_NUMBER = findField("SREG_NUMBER");
  const SREG_NUMBER = {
    name: "SREG_NUMBER MOCK",
    label: "SREG_NUMBER MOCK",
    value: "SREG_NUMBER MOCK",
  };

  const NPOWER = findField("NPOWER");
  const NKVT_POWER = findField("NKVT_POWER");
  const lisOwner = findField("LISOWNER");
  const vehDocDate = findField("DVEHDOCDATE");
  const bodyNumber = findField("SBODYNUMBER");
  const buttonOpen = findField("BUTTON_OPEN");
  const isSaved = window.location.pathname.split("/").pop() !== "0";
  const vehicleChips = findField("IDVEHICLE_POLICY");
  const writeDownSnils = findField("BPHOLDER_SNILS");
  const snilsField = findField("SPHOLDER_SNILS");
  const writeDownOwnerSnils = findField("BOWNER_SNILS");
  const snilsOwnerField = findField("SOWNER_SNILS");
  const ts_type = findField("IDVEHICLETYPE");
  const weight = findField("NWEIGHT");
  const tonnage = findField("NTONNAGE");
  const seatsCount = findField("NSEATS_COUNT");
  const personType = findField("NPERSONTYPE");
  const snilsHolder = findField("SPHOLDER_SNILS");
  const insuredPerson = findField("ITEM_Devider_PHOLDER");

  const TRANSPORT_BLOCK = 2;
  const HOLDER_BLOCK = 3;
  const POLICY_HOLDER = 4;
  const OWNER_BLOCK = 5;

  const isHolderBlock = revealPage(HOLDER_BLOCK);

  // При изменении гос номера скрываем блоки

  if (item.name === "SREGNUM") {
    const fields = ["SREGNUMTITLE", "SREGNUM", "IDVEHICLE_POLICY", "Save"];

    if (isSaved) {
      const isAnyFields = revealFieldVisibilityReverseMode(
        TRANSPORT_BLOCK,
        fields
      );

      if (isAnyFields === true && regNum.value !== "") {
        //  Object.hasOwn(regNum, "afterSave")
        if (isNaN(regNum.value)) {
          const fieldsVisible = [
            "SREGNUMTITLE",
            "SREGNUM",
            "IDVEHICLE_POLICY",
            "Save",
            "BUTTON_OPEN",
            "SBODYNUMBER",
          ];

          // Функция показывает BUTTON_OPEN после сохраннеия id
          setExcludeFieldsVisibility(
            data,
            fieldsVisible,
            TRANSPORT_BLOCK,
            true
          );

          // Скрываем кнопку найти при сохранении id
          saveBtn.visible = false;
        }
        // !Object.hasOwn(regNum, "afterSave")
        if (!isNaN(regNum.value) && regNum.value !== "N") {
          const exeptFieldsForHide = [
            "SREGNUMTITLE",
            "SREGNUM",
            "IDVEHICLE_POLICY",
            "Save",
          ];
          setExcludeFieldsVisibility(
            data,
            exeptFieldsForHide,
            TRANSPORT_BLOCK,
            false
          );

          // При наличии id и изменении номера показываем кнопку 'Найти'
          buttonOpen.visible = true;
        }
      }

      if (regNum.value === "N" && isAnyFields === true) {
        const fields = [
          "SREGNUMTITLE",
          "SREGNUM",
          "IDVEHICLE_POLICY",
          "BUTTON_OPEN",
          "Save",
        ];
        setExcludeFieldsVisibility(data, fields, TRANSPORT_BLOCK, true);
        buttonOpen.visible = false;
      }

      if (regNum.value === "" && isAnyFields === true) {
        const fieldsHide = ["SREGNUMTITLE", "SREGNUM", "IDVEHICLE_POLICY"];
        setExcludeFieldsVisibility(data, fieldsHide, TRANSPORT_BLOCK, false);
      }

      if (regNum.value === "N" && isAnyFields === false) {
        const fields = [
          "SREGNUMTITLE",
          "SREGNUM",
          "IDVEHICLE_POLICY",
          "BUTTON_OPEN",
        ];

        setExcludeFieldsVisibility(data, fields, TRANSPORT_BLOCK, true);
      }

      if (regNum.value === "" && isAnyFields === false) {
        const fieldsHide = ["SREGNUMTITLE", "SREGNUM", "IDVEHICLE_POLICY"];
        setExcludeFieldsVisibility(data, fieldsHide, TRANSPORT_BLOCK, false);
      }

      if (
        regNum.value !== "N" &&
        regNum.value !== "" &&
        isAnyFields === false
      ) {
        const filedsVisible = [
          "SREGNUM",
          "SREGNUMTITLE",
          "IDVEHICLE_POLICY",
          "BUTTON_OPEN",
        ];
        setIncludesFieldsVisibility(data, filedsVisible, TRANSPORT_BLOCK, true);
      }
    }

    if (!isSaved) {
      const isAnyFields = revealFieldVisibilityReverseMode(
        TRANSPORT_BLOCK,
        fields
      );

      console.log("isAnyFields:", isAnyFields);
      console.log("regNum.value:", regNum.value);

      if (isAnyFields === false && regNum.value === "N") {
        let controls;

        if (BNO_VIN.value === true) {
          controls = [
            "SREGNUMTITLE",
            "SREGNUM",
            "IDVEHICLE_POLICY",
            "BUTTON_NEXT",
            "SVIN",
            "Save",
            "BUTTON_OPEN",
          ];
        }

        if (BNO_VIN.value === false) {
          controls = [
            "SREGNUMTITLE",
            "SREGNUM",
            "IDVEHICLE_POLICY",
            "BUTTON_NEXT",
            "SBODYNUMBER",
            "Save",
            "BUTTON_OPEN",
          ];
          bodyNumber.visible = false;
        }

        // скрываем кнопку saveBtn

        saveBtn.visible = false;
        console.log("//");
        setExcludeFieldsVisibility(data, controls, TRANSPORT_BLOCK, true);
      }

      if (isAnyFields === true && regNum.value === "") {
        if (BNO_VIN.value === false) {
          bodyNumber.visible = false;
        }

        const controls = [
          "SREGNUMTITLE",
          "SREGNUM",
          "IDVEHICLE_POLICY",
          "Save",
          "BUTTON_NEXT",
        ];

        saveBtn.visible = false;
        console.log("here");
        setExcludeFieldsVisibility(data, controls, TRANSPORT_BLOCK, false);
      }

      if (
        isAnyFields === false &&
        regNum.value !== "N" &&
        regNum.value !== ""
      ) {
        saveBtn.visible = true;
        console.log("11");
      }

      if (isAnyFields === false && regNum.value === "") {
        saveBtn.visible = false;
        console.log("???");
      }
    }
  }

  // Блок управления видимостью полей по нажатию кнопки 'Рассчитать' после сохранения (появление id)

  if (item.name === "BUTTON_OPEN") {
    const pageFields = [
      "SREGNUMTITLE",
      "SREGNUM",
      "IDVEHICLE_POLICY",
      "BUTTON_OPEN",
    ];

    if (isSaved) {
      const fieldsPage = revealFieldVisibilityReverseMode(
        TRANSPORT_BLOCK,
        pageFields
      );

      if (fieldsPage) {
        setExcludeFieldsVisibility(data, pageFields, TRANSPORT_BLOCK, false);
      }

      if (fieldsPage === false) {
        const pageFields = [
          "SREGNUMTITLE",
          "SREGNUM",
          "IDVEHICLE_POLICY",
          "Save",
        ];
        const fieldsHide = ["BUTTON_OPEN"];
        setExcludeFieldsVisibility(data, pageFields, TRANSPORT_BLOCK, true);
        setIncludesFieldsVisibility(data, fieldsHide, TRANSPORT_BLOCK, false);
      }
    }
  }

  // Выбор чипсы

  if (item.name === "IDVEHICLE_POLICY") {
    const pageFields = ["SREGNUMTITLE", "SREGNUM", "IDVEHICLE_POLICY", "Save"];
    const fieldsPage = revealFieldVisibilityReverseMode(
      TRANSPORT_BLOCK,
      pageFields
    );
    if (isSaved) {
      const exeptFieldsForHide = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
      ];
      const fieldsVisible = ["BUTTON_OPEN"];
      setExcludeFieldsVisibility(
        data,
        exeptFieldsForHide,
        TRANSPORT_BLOCK,
        false
      );
      setIncludesFieldsVisibility(data, fieldsVisible, TRANSPORT_BLOCK, true);
    }

    if (!isSaved) {
      const exeptFieldsForHide = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
      ];
      const fieldsVisible = ["BUTTON_OPEN"];
      setExcludeFieldsVisibility(
        data,
        exeptFieldsForHide,
        TRANSPORT_BLOCK,
        false
      );
      setIncludesFieldsVisibility(data, fieldsVisible, TRANSPORT_BLOCK, true);
    }
  }

  // Переключаем видимость полей СНИЛС по заполнению checkbox во вкладке Страхователь

  if (writeDownSnils.value === true && insuredPerson.visible === true) {
    snilsField.visible = true;
    console.log("!");
  }

  if (writeDownSnils.value === false) {
    snilsField.visible = false;
  }

  if (item.name === "BPHOLDER_SNILS") {
    if (item.value === true) {
      snilsField.visible = true;
      console.log("?");
    }

    if (item.value === false) {
      snilsField.visible = false;
    }
  }

  //  переключаем видимость у полей тоннаж,кол-во мест,грузо-сть

  if (ts_type.value) {
    if (ts_type.value === 4 || ts_type.value === 17) {
      weight.visible = true;
      tonnage.visible = true;
      seatsCount.visible = true;
    } else {
      weight.visible = false;
      tonnage.visible = false;
      seatsCount.visible = false;
    }
  }

  // Переключаем видимость поля СНИЛС по заполнению checkbox во вкладке Собственник

  if (writeDownOwnerSnils.value === true) {
    console.log("?");
    snilsOwnerField.visible = true;
  }

  if (writeDownOwnerSnils.value === false) {
    snilsOwnerField.visible = false;
  }

  if (item.name === "BOWNER_SNILS") {
    if (item.value === true) {
      console.log("!!!");
      snilsOwnerField.visible = true;
    }

    if (item.value === false) {
      snilsOwnerField.visible = false;
    }
  }

  if (item.name === "IDBRAND") {
    if (!IDBRAND.value) {
      IDMODEL.visible = true;
      sModel.value = undefined;
      sModel.state = null;
    }
    if (IDBRAND.value) {
      IDMODEL.visible = true;
      sModel.value = IDBRAND.options.find(
        (item) => item.value === IDBRAND.value
      ).text;
    }
  }

  // Модель (не нашли в списке)
  if (item.name === "IDMODEL") {
    if (model.value) {
      const idModelText = IDMODEL.options.find(
        (item) => item.value === IDMODEL.value
      ).text;
      const brandValue = IDBRAND.options.find(
        (item) => item.value === IDBRAND.value
      ).text;

      if (brandValue === SMODEL.value) {
        sModel.value = `${SMODEL.value} ${idModelText}`;
      }

      if (brandValue !== SMODEL.value) {
        sModel.value = `${brandValue} ${idModelText}`;
      }

      // Логика отображения поля SMODEL если в модели выбрано 'иное'
      // const textValueModel = model.options.find(
      // (el) => el.value === model.value
      // );
      // if (textValueModel?.SNAME) {
      // if (textValueModel.SNAME === "Иное") {
      // sModel.visible = true;
      //  }
      //  if (textValueModel.SNAME !== "Иное") {
      //  sModel.visible = false;
      //  }
      // }
    }
  }

  if (item.name === "SMODEl") {
    if (item.value === "") {
      sModel.state = null;
      sModel.error = null;
    }
  }

  // Настраиваем видимость поля Номер кузова
  // Показываем поле при наличии значения (предзаполнение)

  if (Object.hasOwn(bodyNumber, "value")) {
    const page = revealPage(TRANSPORT_BLOCK);

    if (page === TRANSPORT_BLOCK) {
      if (BNO_VIN.value === false) {
        bodyNumber.visible = false;
      }
    }
  }

  if (!Object.hasOwn(bodyNumber, "value")) {
    // Проблемы с прицепом

    const page = revealPage(TRANSPORT_BLOCK);

    if (page === TRANSPORT_BLOCK) {
      if (BNO_VIN.value === false) {
        bodyNumber.visible = false;
      }
    }
  }

  // При отсутствии VIN скрываем поле

  if (item.name === "BNO_VIN") {
    if (item.value === true) {
      bodyNumber.visible = true;
    }

    if (item.value === false) {
      bodyNumber.visible = false;
    }
  }

  //  Поле модель выбрано (не Иное)  скрываем поле "Модель не нашли в списке"
  const textValueModel = model.options.find((el) => el.value === model.value);

  if (textValueModel === undefined) {
    //  sModel.visible = false;
  }

  // Поле модель выбрано (Иное), показываем поле "Модель не нашли в списке"

  // if (textValueModel !== undefined && typeof textValueModel === "object") {
  // if (Object.hasOwn(textValueModel, "value")) {
  //  if (textValueModel.SNAME !== "Иное") {
  // sModel.visible = false
  // }
  // }
  // }

  // Валидация полей мощности
  // лошадиные силы
  if (item.name === "NPOWER") {
    const fieldNHORSE = findField("NPOWER");
    // Условие если пользователь ввел больше 999
    if (item.value > 999) {
      fieldNHORSE.state = false;
      fieldNHORSE.error = "Значение должно быть от 1 до 999";
    }
    // условие если пользователь ввел 0
    else if (item.value < 1) {
      const fieldNKH = findField("NKVT_POWER");
      fieldNKH.value = null;
      if (fieldNHORSE.state !== null) {
        fieldNKH.state = null;
        fieldNKH.error = "Некорректное значение";
      }
      fieldNHORSE.state = false;
      fieldNHORSE.error = "Значение должно быть от 1 до 999";
    } else if (!item.value) {
      fieldNHORSE.state = false;
    } else {
      const fieldNKH = findField("NKVT_POWER");
      fieldNKH.value = Math.round((Number(item.value) * 100) / 1.3596) / 100;
      fieldNKH.state = true;
      delete fieldNKH.error;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
    }
  }

  // КВТ
  if (item.name === "NKVT_POWER") {
    const fieldNKH = findField("NKVT_POWER");
    // условие если пользователь ввел число больше 734.77
    if (item.value > 734.77) {
      fieldNKH.state = false;
      fieldNKH.error = "Значение должно быть от 1 до 734.77";
      // условие если пользователь ввел 0
    } else if (item.value < 1) {
      const fieldNHORSE = findField("NPOWER");
      fieldNHORSE.value = null;
      if (fieldNKH.state !== null) {
        fieldNHORSE.state = null;
        fieldNHORSE.error = "Некорректное значение";
      }
      fieldNKH.state = false;
      fieldNKH.error = "Значение должно быть от 1 до 734.77";
    } else if (!item.value) {
      fieldNKH.state = false;
    } else {
      const fieldNHORSE = findField("NPOWER");
      fieldNHORSE.value = Math.round(Number(item.value) * 100 * 1.3596) / 100;
      fieldNHORSE.state = true;
      delete fieldNHORSE.error;
      fieldNKH.state = true;
      delete fieldNKH.error;
    }
  }

  // Настраиваем видимость поля Номер кузова
  // Показываем поле при наличии значения (предзаполнение)
  // При отсутствии VIN скрываем поле
  if (item.name === "BNO_VIN") {
    if (BNO_VIN.value === true) {
      data.find((f) => f.name === "SBODYNUMBER").visible = true;
      data.find((f) => f.name === "SVIN").visible = false;
    } else {
      data.find((f) => f.name === "SBODYNUMBER").visible = false;
      data.find((f) => f.name === "SVIN").visible = true;
    }
  }

  // Проверка VIN на количество символов
  if (item.name === "SVIN") {
    if (svin.mask.length > svin.value.length) {
      svin.error = "VIN должен состоять из 17 символов";
      svin.state = false;
    }
    if (svin.mask.length === svin.value.length) {
      svin.error = null;
      svin.state = true;
    }
  }

  // Валидация даты

  if (item.name === "DVEHDOCDATE") {
    const [day, month, year] = item.value.split(".");

    const currentValue = new Date(year, month - 1, day);

    const currentDate = new Date();

    if (currentValue > currentDate) {
      vehDocDate.error = "Дата выдачи не может быть позже текущей даты";
      vehDocDate.state = false;
    }

    if (currentValue < currentDate) {
      vehDocDate.error = null;
      vehDocDate.state = true;
    }
  }

  if (item.name === "IDPHOLDER_COUNTRY") {
    if (IDCOUNTRYDOC.value) {
      IDDOCTYPE.visible = true;
    }
  }

  // Настраиваем логику видимости полей при checkbox 'страхователь является собственником' при загрузке страницы
  if (item.name === "LISOWNER") {
    if (item.value === false) {
      if (parseInt(personType.value) === 1) {
        const fieldsVisible = [
          "LISOWNER",
          "Proceed",
          "NPERSONTYPE",
          "OWNER_BACK_TS",
          "ITEM_Devider_OWNER",
          "SOWNER_SECOND",
          "SOWNER_FIRST",
          "DOWNER_BIRTHDATE",
          "SOWNER_THIRD",
          "SOWNER_PHONE",
          "SOWNER_EMAIL",
          "IDOWNER_COUNTRY",
          "IDOWNER_DOCTYPE",
          "SOWNER_SERIES",
          "SOWNER_PNUMBER",
          "SFULLOWNER_ADDRESS",
          "BOWNER_SNILS",
          "SOWNER_SNILS",
        ];
        setReverseVisibleForSomeFieldsOnCurPage(
          data,
          fieldsVisible,
          OWNER_BLOCK,
          true
        );
      } else if (parseInt(personType.value) === 2) {
        const fieldsVisible = [
          "LISOWNER",
          "Proceed",
          "NPERSONTYPE",
          "OWNER_BACK_TS",
          "ITEM_Devider_OWNER",
          "SJUR_INN",
          "SJUR_NAME",
          "SJUR_PHONE",
          "IDJUR_DOCTYPE",
          "SJUR_SERIES",
          "SJUR_NUMBER",
          "SJUR_ADDRESS",
        ];
        setReverseVisibleForSomeFieldsOnCurPage(
          data,
          fieldsVisible,
          OWNER_BLOCK,
          true
        );
      } else if (
        parseInt(personType.value) !== 2 &&
        parseInt(personType.value) !== 1
      ) {
        setVisibleByPage(OWNER_BLOCK);
      }
    }

    if (item.value === true) {
      console.log("true");
      const fieldsVisible = [
        "OWNER_BACK_TS",
        "ITEM_Devider_OWNER",
        "LISOWNER",
        "Proceed",
      ];
      setReverseVisibleForSomeFieldsOnCurPage(
        data,
        fieldsVisible,
        OWNER_BLOCK,
        true
      );
    }
  }

  if (item.name === "NPERSONTYPE") {
    if (parseInt(item.value) === 1) {
      const fieldsVisible = [
        "LISOWNER",
        "Proceed",
        "NPERSONTYPE",
        "OWNER_BACK_TS",
        "ITEM_Devider_OWNER",
        "SOWNER_SECOND",
        "SOWNER_FIRST",
        "DOWNER_BIRTHDATE",
        "SOWNER_THIRD",
        "SOWNER_PHONE",
        "SOWNER_EMAIL",
        "IDOWNER_COUNTRY",
        "IDOWNER_DOCTYPE",
        "SOWNER_SERIES",
        "SOWNER_PNUMBER",
        "SFULLOWNER_ADDRESS",
        "BOWNER_SNILS",
        "SOWNER_SNILS",
      ];
      setReverseVisibleForSomeFieldsOnCurPage(
        data,
        fieldsVisible,
        OWNER_BLOCK,
        true
      );
    }

    if (parseInt(item.value) === 2) {
      const fieldsVisible = [
        "LISOWNER",
        "Proceed",
        "NPERSONTYPE",
        "OWNER_BACK_TS",
        "ITEM_Devider_OWNER",
        "SJUR_INN",
        "SJUR_NAME",
        "SJUR_PHONE",
        "IDJUR_DOCTYPE",
        "SJUR_SERIES",
        "SJUR_NUMBER",
        "SJUR_ADDRESS",
      ];
      setReverseVisibleForSomeFieldsOnCurPage(
        data,
        fieldsVisible,
        OWNER_BLOCK,
        true
      );
    }
  }

  // управляем видимостью кнопки "Далее" блока первой вкладки
  if (isFilledByPage(TRANSPORT_BLOCK)) {
    BUTTON_NEXT.visible = true;
    BUTTON_NEXT.readonly = false;
  }

  // если поле на странице не прошло валидацию делаем кнопку readOnly
  if (isFilledByPage(TRANSPORT_BLOCK) === false) {
    BUTTON_NEXT.readonly = true;
  }

  if (item.name === "BACK_GENERAL_INFO") {
    let fieldsVisible;

    console.log("BNO_VIN:", BNO_VIN);

    if (BNO_VIN.value === false) {
      fieldsVisible = ["BUTTON_OPEN", "Save", "SBODYNUMBER"];
    }

    if (BNO_VIN.value === true) {
      fieldsVisible = ["BUTTON_OPEN", "Save", "SVIN"];
    }

    setExcludeFieldsVisibility(data, fieldsVisible, TRANSPORT_BLOCK, true);
    setExcludeFieldsVisibility(data, [], HOLDER_BLOCK, false);
  }

  if (item.name === "BUTTON_BACK") {
    // SBODYNUMBER наладить номер кузова
    let controls;

    // writeDownSnils

    if (BNO_VIN.value === true) {
      controls = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
        "Save",
        "BUTTON_NEXT",
        "BUTTON_OPEN",
        "SVIN",
      ];
    }

    if (BNO_VIN.value === false) {
      controls = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
        "Save",
        "BUTTON_NEXT",
        "BUTTON_OPEN",
        "SBODYNUMBER",
      ];
    }

    if (isSaved) {
      const fieldsHide = ["Save"];
      const fieldsVisible = ["BUTTON_OPEN"];
      setIncludesFieldsVisibility(data, fieldsVisible, TRANSPORT_BLOCK, true);
      setIncludesFieldsVisibility(data, fieldsHide, TRANSPORT_BLOCK, false);
    }

    setExcludeFieldsVisibility(data, controls, HOLDER_BLOCK, true);
    setVisibleByPage(OWNER_BLOCK, false);
    setVisibleByPage(POLICY_HOLDER, false);
  }

  if (item.name === "OWNER_BACK_TS") {
    console.log("btn");
    let controls;

    if (BNO_VIN.value === true) {
      controls = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
        "Save",
        "BUTTON_NEXT",
        "BUTTON_OPEN",
        "SVIN",
      ];
    }

    if (BNO_VIN.value === false) {
      controls = [
        "SREGNUMTITLE",
        "SREGNUM",
        "IDVEHICLE_POLICY",
        "Save",
        "BUTTON_NEXT",
        "BUTTON_OPEN",
        "SBODYNUMBER",
      ];
    }

    if (isSaved) {
      const fieldsHide = ["Save"];
      const fieldsVisible = ["BUTTON_OPEN"];
      setIncludesFieldsVisibility(data, fieldsVisible, TRANSPORT_BLOCK, true);
      setIncludesFieldsVisibility(data, fieldsHide, TRANSPORT_BLOCK, false);
    }

    setExcludeFieldsVisibility(data, controls, HOLDER_BLOCK, true);

    // При переключении назад убираем поле СНИЛС, если оно было видимо

    console.log("writeDownSnils.value:", writeDownSnils.value);

    if (writeDownSnils.value === true) {
      // writeDownSnils
      writeDownOwnerSnils.value = false;
      console.log("writeDownSnils:", writeDownSnils);
      setIncludesFieldsVisibility(
        data,
        ["SPHOLDER_SNILS"],
        POLICY_HOLDER,
        false
      );
      snilsHolder.visible = false;
    }

    setVisibleByPage(OWNER_BLOCK, false);
    setVisibleByPage(POLICY_HOLDER, false);
  }

  if (item.name === "BUTTON_NEXT") {
    // Скрываем поле Номер кузова
    bodyNumber.visible = false;

    if (lisOwner.value === true) {
      // setVisibleByPage(TRANSPORT_BLOCK, false);
      // setVisibleByPage(HOLDER_BLOCK);

      const controls = ["Continue"];
      setExcludeFieldsVisibility(data, controls, HOLDER_BLOCK, true);
    }

    if (lisOwner.value === false) {
      // setVisibleByPage(TRANSPORT_BLOCK, false);
      setVisibleByPage(HOLDER_BLOCK);
      // setVisibleByPage(OWNER_BLOCK);
    }

    // Скрываем  поле INFO_TS
    INFO_TS.visible = false;
    // "Save"
    const fieldsNext = ["SREGNUMTITLE", "SREGNUM", "IDVEHICLE_POLICY"];
    setReverseVisibleForSomeFieldsOnCurPage(
      data,
      fieldsNext,
      TRANSPORT_BLOCK,
      true
    );

    INFO_TS.value = ` <div class="row">
  <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
     <div role="group" class="form-group">
        <label for="${SREG_NUMBER.name}" class="d-block"
           ><span>${SREG_NUMBER.label}</span></label
           >
        <div>
           <div>${SREG_NUMBER.value}</div>
        </div>
     </div>
  </div>
  <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
     <div role="group" class="form-group">
        <label for="${NPOWER.name}" class="d-block"
           ><span>${NPOWER.label}</span></label
           >
        <div>
           <div>${NPOWER.value}</div>
        </div>
     </div>
  </div>
  <div class="col-sm-12 col-md-12 col-lg-4 col-xl-nan col-12">
     <div role="group" class="form-group">
        <label for="${NKVT_POWER.name}" class="d-block"
           ><span>${NKVT_POWER.label}</span></label
           >
        <div>
           <div>${NKVT_POWER.value}</div>
        </div>
     </div>
  </div>
</div>
   `;
  }

  // управляем видимостью кнопки "Далее" блока второй вкладки
  if (isVisibleFieldsState(HOLDER_BLOCK)) {
    button_nextToPolicy.readonly = false;
  }

  // если поле на странице не прошло валидацию делаем кнопку readOnly

  if (isVisibleFieldsState(HOLDER_BLOCK) === false) {
    button_nextToPolicy.readonly = true;
  }

  if (item.name === "BUTTON_NEXT_POLICYHOLDER") {
    setExcludeFieldsVisibility(data, [], POLICY_HOLDER, true);
    setExcludeFieldsVisibility(data, [], HOLDER_BLOCK, false);

    const fieldsShow = [
      "ITEM_Devider_OWNER",
      "LISOWNER",
      "OWNER_BACK_TS",
      "Proceed",
    ];
    setIncludesFieldsVisibility(data, fieldsShow, OWNER_BLOCK, true);
    // setExcludeFieldsVisibility(data, [], OWNER_BLOCK, true);
  }

  const dataCopy = JSON.parse(JSON.stringify(data));

  const dataSet = dataCopy.map((e) => {
    if (item.name === "SREGNUM") {
      const { afterSave, ...rest } = e;
      return rest;
    }
    return e;
  });

  return data;
}

function initHandler(data, item) {
  console.log("initHandler", data, item);
  const TRANSPORT_BLOCK = 2;
  const HOLDER_BLOCK = 3;
  const OWNER_BLOCK = 4;
  const BUTTON_OPEN = "BUTTON_OPEN";
  const BUTTON_NEXT = "BUTTON_NEXT";
  const isSaved = window.location.pathname.split("/").pop() !== "0";
  const idBrand = data.find(({ name }) => name === "IDBRAND");
  const sModel = data.find((f) => f.name === "SMODEL");
  const idModel = data.find((f) => f.name === "IDMODEL");

  function setVisibleByPage(page) {
    data.forEach((item) => {
      if (
        item.page === page &&
        item.name !== BUTTON_NEXT &&
        item.name !== "SBODYNUMBER"
      ) {
        item.visible = true;
        item.readonly = false;
      }
    });
  }

  function setExcludeFieldsVisibility(
    data,
    someFields,
    pageNumber,
    visibility
  ) {
    data.forEach((item) => {
      if (item.page === pageNumber) {
        if (!someFields.includes(item.name)) {
          item.visible = visibility;
          item.readonly = false;
        }
      }
    });
  }

  if (isSaved) {
    console.log("isSaved:", isSaved);
    const fieldsShouldNotBeShown = [
      "BUTTON_NEXT",
      "BUTTON_OPEN",
      "Save",
      "SBODYNUMBER",
    ];

    setExcludeFieldsVisibility(
      data,
      fieldsShouldNotBeShown,
      TRANSPORT_BLOCK,
      true
    );
    // setVisibleByPage(TRANSPORT_BLOCK);
  }

  const dataCopy = JSON.parse(JSON.stringify(data));

  const dataSet = dataCopy.map((item) => {
    if (item.name === "SREGNUM") {
      return { ...item, afterSave: true };
    }
    return item;
  });

  return data;
}
export { eventHandler, initHandler };
