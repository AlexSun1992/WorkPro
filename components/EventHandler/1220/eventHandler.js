export function initHandler(data) {
  const link = this.getWindowLocation.hash;
  const continueBtn = data.find((f) => f.name === "Continue");
  const saveBtn = data.find((f) => f.name === "Save");
  const id = data.find((f) => f.name === "ID");
  const address = data.find((f) => f.name === "SADDRESS_DATA");
  const choise = data.find((f) => f.name === "IDCHOISE");
  const tvariant = data.find((f) => f.name === "TITLE_VARIANT");
  const variant = data.find((f) => f.name === "IDVARIANT_LIST");
  const continuosly = data.find((f) => f.name === "ITEM53058");
  const idninsured = data.find((f) => f.name === "IDNINSURED_SUM_GO");
  const decor = data.find((f) => f.name === "NSUM_DECOR");
  const proper = data.find((f) => f.name === "NSUM_PROPER");
  const constr = data.find((f) => f.name === "NSUM_CONSTR");
  const summ = data.find((f) => f.name === "NSUM_CREDIT");
  const switcher = data.find((f) => f.name === "BFRANCH");
  const franshiza = data.find((f) => f.name === "IDDEDUCTIBLE");
  const bterror = data.find((f) => f.name === "BTERROR");
  const bwear_excluded = data.find((f) => f.name === "BWEAR_EXCLUDED");
  const homeservice = data.find((f) => f.name === "BHOME_SERVICE");
  const bterror_included = data.find((f) => f.name === "BTERROR_INCLUDED");
  const bwear_excluded_included = data.find((f) => f.name === "BWEAR_EXCLUDED_INCLUDED");
  const bhome_service_included = data.find((f) => f.name === "BHOME_SERVICE_INCLUDED");
  const empty_block = data.find((f) => f.name === "EmptyBlok1");
  const promocode = data.find((f) => f.name === "SPROMOCODE");
  const promocode_button = data.find((f) => f.name === "Item52121");

  if (link?.startsWith("#")) {
    if (document.querySelector(".radio-btn")) {
      const radioButton = document.querySelector(".radio-btn");
      window.scrollTo(
        0,
        radioButton.offsetTop +
          // - window.innerHeight / 2
          radioButton.offsetHeight
      );
    }
  }

  if (link?.startsWith("#")) {
    choise.value = 2;
  }

  if (choise?.value == 2) {
    continuosly.visible = true;
    idninsured.visible = true;
    decor.visible = true;
    proper.visible = true;
    constr.visible = true;
    variant.cssClass = "d-none";
    tvariant.visible = false;
    switcher.visible = true;
    promocode.visible = true;
    promocode_button.visible = true;
    homeservice.visible = true;
    bterror_included.visible = false;
    bwear_excluded_included.visible = false;
    bhome_service_included.visible = false;
    if (switcher.value === false) {
      franshiza.visible = false;
      empty_block.visible = true;
    }
    if (switcher.value === true) {
      franshiza.visible = true;
      empty_block.visible = false;
    }

    if (decor.value > 3000000) {
      decor.value = 3000000;
    }
    if (proper.value > 2000000) {
      proper.value = 2000000;
    }
    if (constr.value > 10000000) {
      constr.value = 10000000;
    }
  }
  if (choise?.value == 1) {
    continuosly.visible = false;
    idninsured.visible = false;
    decor.visible = false;
    proper.visible = false;
    constr.visible = false;
    variant.cssClass = "";
    variant.visible = true;
    tvariant.visible = true;
    switcher.visible = false;
    franshiza.visible = false;
    empty_block.visible = false;
    promocode.visible = false;
    promocode_button.visible = false;

    const search_variants_terror = [345, 346, 347, 348, 349];
    const search_all_inclusive = [346, 347, 348, 349];
    variant.value = Number(variant.value);
    if (search_variants_terror.includes(variant.value)) {
      bterror_included.visible = true;
      bterror.visible = false;
      if (search_all_inclusive.includes(variant.value)) {
        bwear_excluded_included.visible = true;
        bhome_service_included.visible = true;
        bwear_excluded.visible = false;
        homeservice.visible = false;
      } else {
        bwear_excluded_included.visible = false;
        bhome_service_included.visible = false;
        bwear_excluded.visible = true;
        homeservice.visible = true;
      }
    } else {
      bterror_included.visible = false;
      bwear_excluded_included.visible = false;
      bhome_service_included.visible = false;
      bterror.visible = true;
      bwear_excluded.visible = true;
      homeservice.visible = true;
    }
  }

  if (choise?.value == 3) {
    continuosly.visible = false;
    idninsured.visible = false;
    decor.visible = false;
    proper.visible = false;
    constr.visible = false;
    variant.cssClass = "d-none";
    tvariant.visible = false;
    switcher.visible = false;
    franshiza.visible = false;
    empty_block.visible = false;
    promocode.visible = false;
    promocode_button.visible = false;
    homeservice.visible = true;
    bterror_included.visible = false;
    bwear_excluded_included.visible = false;
    bhome_service_included.visible = false;
  }

  if (choise?.value == 1 || choise?.value == 2) {
    // data.find((f) => f.name === "BRISKZALIV").visible = true;
    // data.find((f) => f.name === "BRISKZALIVMORTGAGE").visible = false;
    // data.find((f) => f.name === "BRISKVZRIV").visible = true;
    // data.find((f) => f.name === "BRISKDEFECTS").visible = false;
    // data.find((f) => f.name === "EXCEPTIONS_INFO").visible = true;
    // data.find((f) => f.name === "COLLAPSE_DATA_IFL").visible = true;
    // data.find((f) => f.name === "INFO_COLLAPSE_DATA").visible = false;
    // data.find((f) => f.name === "COLLAPSE_DATA_MORTGAGE").visible = false;
    // data.find((f) => f.name === "SFULL_LIST_RISKS").visible = false;
    data.find((f) => f.name === "BCL_REPAIR_EXCLUDED").visible = true;
    data.find((f) => f.name === "ITEM68972").visible = false;
    data.find((f) => f.name === "DCREDIT_DATE").visible = false;
    data.find((f) => f.name === "SCREDIT_NUMBER").visible = false;
    data.find((f) => f.name === "NSUM_CREDIT").visible = false;
    data.find((f) => f.name === "DFROM_DATE").visible = true;
    data.find((f) => f.name === "DFROM_DATE_MORTGAGE").visible = false;
  }
  if (choise?.value == 3) {
    // data.find((f) => f.name === "BRISKZALIV").visible = false;
    // data.find((f) => f.name === "BRISKZALIVMORTGAGE").visible = true;
    // data.find((f) => f.name === "BRISKVZRIV").visible = false;
    // data.find((f) => f.name === "BRISKDEFECTS").visible = true;
    data.find((f) => f.name === "BTERROR").visible = false;
    // data.find((f) => f.name === "EXCEPTIONS_INFO").visible = false;
    // data.find((f) => f.name === "COLLAPSE_DATA_IFL").visible = false;
    // data.find((f) => f.name === "SLIST_EXCEPTIONS").visible = false;
    // data.find((f) => f.name === "INFO_COLLAPSE_DATA").visible = true;
    // data.find((f) => f.name === "COLLAPSE_DATA_MORTGAGE").visible = true;
    data.find((f) => f.name === "BCL_REPAIR_EXCLUDED").visible = false;
    data.find((f) => f.name === "ITEM68972").visible = true;
    data.find((f) => f.name === "DCREDIT_DATE").visible = true;
    data.find((f) => f.name === "SCREDIT_NUMBER").visible = true;
    data.find((f) => f.name === "NSUM_CREDIT").visible = true;
    data.find((f) => f.name === "DFROM_DATE").visible = false;
    data.find((f) => f.name === "DFROM_DATE_MORTGAGE").visible = true;
  }

  // console.log(address.value);

  if (choise?.value == 3) {
    summ.value = summ.value
      .toString()
      .replace(/\s/g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
    money = summ.value.replace(/\s/g, "").replace(/,/g, ".");

    if (
      address.value?.startsWith("<b>г Москва") ||
      address.value?.startsWith("<b>г Санкт-Петербург") ||
      address.value?.startsWith("<b>Московская обл") ||
      address.value?.startsWith("<b>Ленинградская обл")
    ) {
      if (!parseFloat(money) || parseFloat(money) < 0 || parseFloat(money) > 10000000) {
        summ.error = "Остаток долга по ипотеке для вашего региона должен быть до 10 млн руб";
        summ.state = false;
      } else {
        summ.error = null;
        summ.state = true;
      }
    } else if (!parseFloat(money) || parseFloat(money) < 0 || parseFloat(money) > 5000000) {
      summ.error = "Остаток долга по ипотеке для вашего региона должен быть до 5 млн руб";
      summ.state = false;
    } else {
      summ.error = null;
      summ.state = true;
    }
  }

  if (continueBtn?.visible === false) {
    if (saveBtn) {
      saveBtn.cssClass = "mb-3";
      saveBtn.cssClass = "btn-primary";
      return data;
    }
  }
  if (continueBtn?.visible === true) {
    setTimeout(() => {
      if (document.querySelector(".price-block")) {
        const priceBlock = document.querySelector(".price-block");
        window.scrollTo(0, priceBlock.offsetTop - window.innerHeight / 2 + priceBlock.offsetHeight);
      }
    }, 0);
    if (saveBtn) {
      saveBtn.cssClass = "btn-secondary mb-3";
      return data;
    }
  }

  return data;
}

export function eventHandler(data, item) {
  const continueBtn = data.find((f) => f.name === "Continue");
  const saveBtn = data.find((f) => f.name === "Save");
  const id = data.find((f) => f.name === "ID");
  const address = data.find((f) => f.name === "SADDRESS_DATA");
  const creationReason = data.find((f) => f.name === "NCREATE_MODE");
  const choise = data.find((f) => f.name === "IDCHOISE");
  const tvariant = data.find((f) => f.name === "TITLE_VARIANT");
  const variant = data.find((f) => f.name === "IDVARIANT_LIST");
  const continuosly = data.find((f) => f.name === "ITEM53058");
  const idninsured = data.find((f) => f.name === "IDNINSURED_SUM_GO");
  const decor = data.find((f) => f.name === "NSUM_DECOR");
  const proper = data.find((f) => f.name === "NSUM_PROPER");
  const constr = data.find((f) => f.name === "NSUM_CONSTR");
  const summ = data.find((f) => f.name === "NSUM_CREDIT");
  const switcher = data.find((f) => f.name === "BFRANCH");
  const franshiza = data.find((f) => f.name === "IDDEDUCTIBLE");
  const bterror = data.find((f) => f.name === "BTERROR");
  const bwear_excluded = data.find((f) => f.name === "BWEAR_EXCLUDED");
  const homeservice = data.find((f) => f.name === "BHOME_SERVICE");
  const bterror_included = data.find((f) => f.name === "BTERROR_INCLUDED");
  const bwear_excluded_included = data.find((f) => f.name === "BWEAR_EXCLUDED_INCLUDED");
  const bhome_service_included = data.find((f) => f.name === "BHOME_SERVICE_INCLUDED");
  const minDatePoliceBegin = data.find((f) => f.name === "DDATEINF");
  const from_date = data.find((f) => f.name === "DFROM_DATE");
  const empty_block = data.find((f) => f.name === "EmptyBlok1");
  const promocode = data.find((f) => f.name === "SPROMOCODE");
  const promocode_button = data.find((f) => f.name === "Item52121");
  const pub_modality = data.find((f) => f.name === "ITEM50091");
  const prev_modality = data.find((f) => f.name === "ITEM53073");

  if (window.Location?.hash) {
    choise.value = 2;
  }

  if (choise?.value == 2) {
    continuosly.visible = true;
    idninsured.visible = true;
    decor.visible = true;
    proper.visible = true;
    constr.visible = true;
    variant.cssClass = "d-none";
    variant.visible = false;
    tvariant.visible = false;
    switcher.visible = true;
    homeservice.visible = true;
    promocode.visible = true;
    promocode_button.visible = true;
    bterror_included.visible = false;
    bwear_excluded_included.visible = false;
    bhome_service_included.visible = false;
    bterror.visible = true;
    bwear_excluded.visible = true;
    if (switcher.value === false) {
      franshiza.visible = false;
      empty_block.visible = true;
    }
    if (switcher.value === true) {
      franshiza.visible = true;
      empty_block.visible = false;
    }
  }
  if (choise?.value == 1 || (item.name === "IDCHOISE" && item.value === 1)) {
    continuosly.visible = false;
    idninsured.visible = false;
    decor.visible = false;
    proper.visible = false;
    constr.visible = false;
    variant.cssClass = "";
    variant.visible = true;
    tvariant.visible = true;
    switcher.visible = false;
    franshiza.visible = false;
    empty_block.visible = false;
    homeservice.visible = true;
    promocode.visible = false;
    promocode_button.visible = false;
    const search_variants_terror = [345, 346, 347, 348, 349];
    const search_all_inclusive = [346, 347, 348, 349];
    if (search_variants_terror.includes(variant.value)) {
      bterror_included.visible = true;
      bterror.visible = false;

      if (search_all_inclusive.includes(variant.value)) {
        bwear_excluded_included.visible = true;
        bhome_service_included.visible = true;
        bwear_excluded.visible = false;
        homeservice.visible = false;
      } else {
        bwear_excluded_included.visible = false;
        bhome_service_included.visible = false;
        bwear_excluded.visible = true;
        homeservice.visible = true;
      }
    } else {
      bterror_included.visible = false;
      bwear_excluded_included.visible = false;
      bhome_service_included.visible = false;
      bterror.visible = true;
      bwear_excluded.visible = true;
      homeservice.visible = true;
    }
  }
  if (choise?.value == 3) {
    continuosly.visible = false;
    idninsured.visible = false;
    decor.visible = false;
    proper.visible = false;
    constr.visible = false;
    variant.cssClass = "d-none";
    variant.visible = false;
    tvariant.visible = false;
    switcher.visible = false;
    franshiza.visible = false;
    empty_block.visible = false;
    homeservice.visible = false;
    promocode.visible = false;
    promocode_button.visible = false;
    bterror_included.visible = false;
    bwear_excluded_included.visible = false;
    bhome_service_included.visible = false;
  }

  if (choise?.value == 1 || choise?.value == 2) {
    // data.find((f) => f.name === "BRISKZALIV").visible = true;
    // data.find((f) => f.name === "BRISKZALIVMORTGAGE").visible = false;
    // data.find((f) => f.name === "BRISKVZRIV").visible = true;
    // data.find((f) => f.name === "BRISKDEFECTS").visible = false;
    // data.find((f) => f.name === "EXCEPTIONS_INFO").visible = true;
    // data.find((f) => f.name === "COLLAPSE_DATA_IFL").visible = true;
    // data.find((f) => f.name === "INFO_COLLAPSE_DATA").visible = false;
    // data.find((f) => f.name === "COLLAPSE_DATA_MORTGAGE").visible = false;
    // data.find((f) => f.name === "SFULL_LIST_RISKS").visible = false;
    data.find((f) => f.name === "BCL_REPAIR_EXCLUDED").visible = true;
    data.find((f) => f.name === "ITEM68972").visible = false;
    data.find((f) => f.name === "DCREDIT_DATE").visible = false;
    data.find((f) => f.name === "SCREDIT_NUMBER").visible = false;
    data.find((f) => f.name === "NSUM_CREDIT").visible = false;
    data.find((f) => f.name === "DFROM_DATE").visible = true;
    data.find((f) => f.name === "DFROM_DATE_MORTGAGE").visible = false;
  }
  if (choise?.value == 3) {
    // data.find((f) => f.name === "BRISKZALIV").visible = false;
    // data.find((f) => f.name === "BRISKZALIVMORTGAGE").visible = true;
    // data.find((f) => f.name === "BRISKVZRIV").visible = false;
    // data.find((f) => f.name === "BRISKDEFECTS").visible = true;
    data.find((f) => f.name === "BTERROR").visible = false;
    // data.find((f) => f.name === "EXCEPTIONS_INFO").visible = false;
    // data.find((f) => f.name === "COLLAPSE_DATA_IFL").visible = false;
    // data.find((f) => f.name === "SLIST_EXCEPTIONS").visible = false;
    // data.find((f) => f.name === "INFO_COLLAPSE_DATA").visible = true;
    // data.find((f) => f.name === "COLLAPSE_DATA_MORTGAGE").visible = true;
    data.find((f) => f.name === "BWEAR_EXCLUDED").visible = false;
    data.find((f) => f.name === "BCL_REPAIR_EXCLUDED").visible = false;
    data.find((f) => f.name === "ITEM68972").visible = true;
    data.find((f) => f.name === "DCREDIT_DATE").visible = true;
    data.find((f) => f.name === "SCREDIT_NUMBER").visible = true;
    data.find((f) => f.name === "NSUM_CREDIT").visible = true;
    data.find((f) => f.name === "DFROM_DATE").visible = false;
    data.find((f) => f.name === "DFROM_DATE_MORTGAGE").visible = true;
  }

  // console.log("3");

  const field = data.find((f) => f.fieldId === item.fieldId);

  if (!field) {
    return data;
  }

  // console.log("4");

  if (field?.name === "IDVARIANT_LIST") {
    if (item.value) {
      const search_variants_terror = [345, 346, 347, 348, 349];
      const search_all_inclusive = [346, 347, 348, 349];
      if (search_variants_terror.includes(item.value)) {
        bterror_included.visible = true;
        bterror.visible = false;

        if (search_all_inclusive.includes(item.value)) {
          bwear_excluded_included.visible = true;
          bhome_service_included.visible = true;
          bwear_excluded.visible = false;
          homeservice.visible = false;
        } else {
          bwear_excluded_included.visible = false;
          bhome_service_included.visible = false;
          bwear_excluded.visible = true;
          homeservice.visible = true;
        }
      } else {
        bterror_included.visible = false;
        bwear_excluded_included.visible = false;
        bhome_service_included.visible = false;
        bterror.visible = true;
        bwear_excluded.visible = true;
        homeservice.visible = true;
      }
    }
    return data;
  }

  if (field?.name === "DFROM_DATE") {
    // console.log('item.value:',item)
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item?.value) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, Number(mFrom) - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateFrom = new Date(yFrom, Number(mFrom) - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      const formattedDate = [dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      const toDate = data.find((f) => f.name === "DTO_DATE");
      toDate.value = formattedDate;
      dateFrom = new Date(dFrom, mFrom, yFrom);
      const inputDateField = data.find((f) => f.name === "DINPUT_DATE");
      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");

        const dateInput = new Date(dInput, Number(mInput) - 1, yInput);

        const currentDate = new Date(); // определяю текущую дату
        const MaxInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput) + 45);
        const MinInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput) + 7);

        const [dInputBeginDate, mInputBeginDate, yInputBeginDate] = minDatePoliceBegin.value.split(".");
        const minPoliceBeginProlongationDate = new Date(yInputBeginDate, Number(mInputBeginDate) - 1, dInputBeginDate);
        const maxPoliceBeginProlongationDate = new Date(
          yInputBeginDate,
          Number(mInputBeginDate) - 1,
          Number(dInputBeginDate) + 45
        );

        function turnDateToString(date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear());
          const minDateSet = [day, month, year];
          const minDate = minDateSet.join(".");
          return minDate;
        }
        if (creationReason.value === 1 && dateInputDate < MinInputDate) {
          // item.value = null
          const minDate = turnDateToString(MinInputDate);
          field.error = `Дата начала действия полиса должна быть не ранее ${minDate}`;
          field.state = false;
        } else if (creationReason.value === 1 && dateInputDate > MaxInputDate) {
          const maxDate = turnDateToString(MaxInputDate);
          field.error = `Дата начала должна быть не позже ${maxDate}`;
          field.state = false;
        } else if (creationReason.value === 3 && dateInputDate < minPoliceBeginProlongationDate) {
          const minDateProlongation = turnDateToString(minPoliceBeginProlongationDate);
          field.error = `Дата начала действия полиса должна быть не ранее ${minDateProlongation}`;
          field.state = false;
        } else if (creationReason.value === 3 && dateInputDate > maxPoliceBeginProlongationDate) {
          const maxDateProlongation = turnDateToString(maxPoliceBeginProlongationDate);
          field.error = `Дата начала должна быть не позже ${maxDateProlongation}`;
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
      return data;
    }
  }

  if (field?.name === "DFROM_DATE_MORTGAGE") {
    // console.log('item.value:',item)
    if (!item.value) {
      field.error = null;
      return data;
    }

    if (item?.value) {
      const [dFrom, mFrom, yFrom] = item.value.split(".");
      const dateInputDate = new Date(yFrom, Number(mFrom) - 1, dFrom); // добавил переменную, т.к в следующем блоке if переменная dateInput не обновляется
      let dateFrom = new Date(yFrom, Number(mFrom) - 1, dFrom);
      dateFrom.setFullYear(dateFrom.getFullYear() + 1);
      dateFrom.setDate(dateFrom.getDate() - 1);
      const formattedDate = [dateFrom.getDate(), dateFrom.getMonth() + 1, dateFrom.getFullYear()]
        .map((n) => (n < 10 ? `0${n}` : `${n}`))
        .join(".");
      const toDate = data.find((f) => f.name === "DTO_DATE");
      toDate.value = formattedDate;
      dateFrom = new Date(dFrom, mFrom, yFrom);
      const inputDateField = data.find((f) => f.name === "DINPUT_DATE");

      if (inputDateField.value) {
        const [dInput, mInput, yInput] = inputDateField.value.split(".");

        const dateInput = new Date(dInput, Number(mInput) - 1, yInput);

        const currentDate = new Date(); // определяю текущую дату
        const MaxInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput) + 60);
        const MinInputDate = new Date(yInput, Number(mInput) - 1, Number(dInput));

        const [dInputBeginDate, mInputBeginDate, yInputBeginDate] = minDatePoliceBegin.value.split(".");
        const minPoliceBeginProlongationDate = new Date(yInputBeginDate, Number(mInputBeginDate) - 1, dInputBeginDate);
        const maxPoliceBeginProlongationDate = new Date(
          yInputBeginDate,
          Number(mInputBeginDate) - 1,
          Number(dInputBeginDate) + 45
        );

        function turnDateToString(date) {
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = String(date.getFullYear());
          const minDateSet = [day, month, year];
          const minDate = minDateSet.join(".");
          return minDate;
        }

        if (creationReason.value === 1 && dateInputDate < MinInputDate) {
          // item.value = null
          const minDate = turnDateToString(MinInputDate);
          field.error = `Дата начала действия полиса должна быть не ранее ${minDate}`;
          field.state = false;
        } else if (creationReason.value === 1 && dateInputDate > MaxInputDate) {
          const maxDate = turnDateToString(MaxInputDate);
          field.error = `Дата начала должна быть не позже ${maxDate}`;
          field.state = false;
        } else if (creationReason.value === 3 && dateInputDate < minPoliceBeginProlongationDate) {
          const minDateProlongation = turnDateToString(minPoliceBeginProlongationDate);
          field.error = `Дата начала действия полиса должна быть не ранее ${minDateProlongation}`;
          field.state = false;
        } else if (creationReason.value === 3 && dateInputDate > maxPoliceBeginProlongationDate) {
          const maxDateProlongation = turnDateToString(maxPoliceBeginProlongationDate);
          field.error = `Дата начала должна быть не позже ${maxDateProlongation}`;
          field.state = false;
        } else {
          field.state = true;
          field.error = null;
        }
      }
      return data;
    }
  }

  if (field.name === "DINPUT_DATE") {
    data.find((f) => f.name === "DFROM_DATE").value = null;
    data.find((f) => f.name === "DFROM_DATE_MORTGAGE").value = null;
    data.find((f) => f.name === "DTO_DATE").value = null;
    return data;
  }

  if (choise?.value == 3) {
    summ.value = summ.value
      .toString()
      .replace(/\s+/g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");
  }

  if (field.name === "NSUM_CREDIT") {
    money = summ.value.replace(/\s/g, "").replace(/,/g, ".");
    if (
      address.value?.startsWith("<b>г Москва") ||
      address.value?.startsWith("<b>г Санкт-Петербург") ||
      address.value?.startsWith("<b>Московская обл") ||
      address.value?.startsWith("<b>Ленинградская обл")
    ) {
      if (!parseFloat(money) || parseFloat(money) < 0 || parseFloat(money) > 10000000) {
        field.error = "Остаток долга по ипотеке для вашего региона должен быть до 10 млн руб";
        field.state = false;
      } else {
        field.error = null;
        field.state = true;
      }
    } else if (!parseFloat(money) || parseFloat(money) < 0 || parseFloat(money) > 5000000) {
      field.error = "Остаток долга по ипотеке для вашего региона должен быть до 5 млн руб";
      field.state = false;
    } else {
      field.error = null;
      field.state = true;
    }
  }

  return data;
}
