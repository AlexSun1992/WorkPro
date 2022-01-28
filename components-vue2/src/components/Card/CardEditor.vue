<template>
  <div>
    <FormBlock
      :data="getForm"
      :edit="!isReadOnly"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
      v-if="isBlock"
    />

    <Form
      :data="getForm"
      :edit="!isReadOnly"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
      v-if="!isBlock"
    />

    <div>
      <b-alert
        :show="getSavedError || getError"
        variant="danger"
        class="mt-3 mb-0"
      >
        {{ getErrorMessage }}
      </b-alert>
    </div>
    <div
      v-if="getBtnSave && isShowButtonSave && !getError"
      class="row mt-4 ml-2"
    >
      <b-button
        pill
        :disabled="isSaving"
        :class="'btn-lg'"
        v-on:click="saveCard()"
        type="button"
        variant="success"
        class="col-12 col-md-auto mt-3 mt-md-0"
        :style="isButtonDisabled"
      >
        Сохранить
        <b-spinner
          v-if="isSaving"
          style="width: 1rem; height: 1rem"
          class="ml-2"
          variant="danger"
          label="Spinning"
        ></b-spinner>
      </b-button>
    </div>
  </div>
</template>
<script>
async function eventHandler(fields, action, func) {
  // console.log(new Date().toISOString(), "action", action);

  /**
   * Поиск одного поля
   * @param { import("./configurator.service.55-777.types").FieldName } name
   * @returns { import("./configurator.service.55-777.types").Field777 }
   */
  function findField(name) {
    const field = fields.find((item) => item.name === name);
    if (field) {
      return field;
    }

    throw new Error(`Поле ${name} не найдено в данных`);
  }

  const citySettlement = fields.find((f) => f.name === "SCITY_SETTLEMENT");
  const ownerAge = fields.find((f) => f.name === "NOWNER_AGE");
  const emptyOne = fields.find((f) => f.name === "Empty");
  const vehicleModel = fields.find((f) => f.name === "SVEHICLE_MODEL");
  const yearVehicle = fields.find((f) => f.name === "NYEAR_VEHICLE");
  const horseVehiclePower = fields.find(
    (f) => f.name === "NHORSE_VEHICLE_POWER"
  );
  const khVeiclePower = fields.find((f) => f.name === "NKH_VEHICLE_POWER");
  const emptyTwo = fields.find((f) => f.name === "Empty");
  const driverType = fields.find((f) => f.name === "NDRIVER_TYPE");
  const emptyField1 = fields.find((f) => f.name === "EMPTY_FIELD_1");
  const drAge1 = fields.find((f) => f.name === "NDR_AGE_1");
  const drExperience1 = fields.find((f) => f.name === "NDR_EXPERIENCE_1");
  const srNoCrash1 = fields.find((f) => f.name === "NDR_NO_CRASH_1");
  const empryThree = fields.find((f) => f.name === "empty");
  const addDriver = fields.find((f) => f.name === "ADD_DRIVER");
  const emptyField3 = fields.find((f) => f.name === "EMPTY_FIELD_3");
  const fillInmanually = fields.find((f) => f.name === "SFILLINMANUALLY");
  const calculatePolis = fields.find((f) => f.name === "SCALCULATEPOLIS");
  const checkRegNumber = fields.find((f) => f.name === "LCHECKREGNUMBER");
  const regNumber = fields.find((f) => f.name === "SREGNUMBER");
  const isCaptchaNeeded = fields.find((f) => f.name === "BISCAPTCHANEEDED");
  const url = new URL("/free/v2/osago/findAuto", window.location);

  function showForm() {
    citySettlement.visible = true;
    ownerAge.visible = true;
    emptyOne.visible = true;
    vehicleModel.visible = true;
    yearVehicle.visible = true;
    horseVehiclePower.visible = true;
    khVeiclePower.visible = true;
    emptyTwo.visible = true;
    driverType.visible = true;

    findField("NNO_CRASH_YEARS").visible = true;
    emptyField1.visible = true;
    empryThree.visible = true;
    emptyField3.visible = true;
    findField("z-two").visible = true;
    findField("z-three").visible = true;
    findField("z-four").visible = true;
    fillInmanually.visible = false;
    calculatePolis.visible = false;
    findField(`Item36585`).visible = true;
    if (isCaptchaNeeded.value === true) {
      findField(`CAPTCHA`).visible = true;
    }
  }

  function hideForm() {
    citySettlement.visible = false;
    ownerAge.visible = false;
    emptyOne.visible = false;
    vehicleModel.visible = false;
    yearVehicle.visible = false;
    horseVehiclePower.visible = false;
    khVeiclePower.visible = false;
    emptyTwo.visible = false;
    driverType.visible = false;

    findField("NNO_CRASH_YEARS").visible = false;
    emptyField1.visible = false;
    empryThree.visible = false;
    emptyField3.visible = false;

    fillInmanually.visible = true;
    calculatePolis.visible = true;
    findField(`Item36585`).visible = false;
    findField(`CAPTCHA`).visible = false;
    findField("z-two").visible = false;
    findField("z-three").visible = false;
    findField("z-four").visible = false;
  }

  if (action.value === "SFILLINMANUALLY" || action.name === "LCHECKREGNUMBER") {
    /* нажатие на кнопку "ввести вручную" */
    if (action.value === false) {
      regNumber.readonly = false;
      hideForm();
    } else {
      findField("LCHECKREGNUMBER").value = true;
      regNumber.readonly = true;
      showForm();
    }
  }

  if (action.value === "SCALCULATEPOLIS") {
    // /* нажатие на кнопку "нажатие на кнопку "Рассчитать автоматически"

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
    const autoInfo = regNumber.value ? await getInfo(regNumber.value) : [];
    if (autoInfo.length > 0) {
      vehicleModel.value = autoInfo[0].MAKE_MODEL;
      vehicleModel.id = autoInfo[0].BRAND_MODEL_MODIFICATION;
      yearVehicle.value = autoInfo[0].NBUILD_YEAR;
      horseVehiclePower.value = autoInfo[0].OUTPUT;
      khVeiclePower.value = autoInfo[0].POWER_KVT;
    }

    showForm();
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
      // `DR_TYPE_${driverId}`,
      `NDR_AGE_${driverId}`,
      `NDR_EXPERIENCE_${driverId}`,
      `NDR_NO_CRASH_${driverId}`,
    ];
    return fields.filter((item) => driverFieldNames.includes(item.name));
  }

  if (action.name === "NDRIVER_TYPE" && action.value === "1") {
    const visibleDriversCount = getVisibleDriversCount();

    findField("ADD_DRIVER").visible = false;
    findField("NNO_CRASH_YEARS").visible = true;
    findField("NDRIVER_TYPE").visible = true;

    for (let i = 1; i <= visibleDriversCount; i++) {
      deleteDriver(1);
    }
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

  if (action.name === "NDRIVER_TYPE" && action.value === "2") {
    showDriver(1);
    findField("DL_BUTTON_1").visible = false;
    findField("DR_TYPE_1").visible = false;
    findField("NNO_CRASH_YEARS").visible = false;
    findField("ADD_DRIVER").visible = true;
    findField("empty_DL_BUTTON_1").visible = true;
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

  if (action.value !== "Item36585") {
    // findField(`CAPTCHA`).visible = true;
    // findField(`ISSUE_POLICY`).visible = false;
    // findField(`NPRICE`).visible = false;
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
    console.log(9999, action);
    yearVehicle.error = "Заполните год!";
  }

  return fields;
}

import { mapGetters } from "vuex";
import Form from "/../components/Libs/Form/Form.vue";
import FormBlock from "/../components/Libs/Form/FormBlock.vue";
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import VueEasyTooltip from "vue-easy-tooltip";
Vue.use(LoadScript);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component("vue-easy-tooltip", VueEasyTooltip);

const TOKEN_NAME = "auth._token.local";

export default {
  name: "CardEditor",
  components: { FormBlock, Form },
  props: {
    moduleId: {
      type: Number,
      required: true,
    },
    menuId: {
      type: Number,
      required: true,
    },
    cardId: {
      type: Number,
      required: false,
      default: null,
    },
    rel: {
      type: String,
      required: false,
      default: null,
    },
    zone: {
      type: String,
      required: false,
      default: "free",
    },
  },
  data() {
    return {
      params: {
        idItem: this.menuId,
        idModule: this.moduleId,
        idParent: "0",
        idCard: "0",
        idRel: "0",
        zone: this.zone,
      },
      isShowSavedError: false,
      eventHandler: null,
      isButtonDisabled: false,
      isSaving: false,
      isShowButtonSave: false,
    };
  },
  async created() {
    try {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        this.$axios.defaults.headers.common["Authorization"] = token;
      }
      await this.$loadScript(
        `/api/card/js/${this.moduleId}/${this.menuId}?zone=${
          this.zone
        }&time=${Date.now()}`
      );
      await this.$store.dispatch("menu/fetchMenu", this.params);
      this.eventHandler =
        typeof eventHandler === "function" ? eventHandler : null;
      await this.fetchCard();
      this.setting = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      this.isShowButtonSave = true;
    } catch (e) {
      this.$store.commit("data_card/setLoading", false);
      this.$store.commit("data_card/setDisabled", false);
      this.$store.commit("data_card/setSavedError", true);
      this.$store.commit(
        "data_card/setErrorMessage",
        e?.response?.data || { MESSAGE: "Ошибка отображения компонента" }
      );
    }
  },
  computed: {
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getErrorMessage",
      "getSavedError",
      "getError",
      "getBtnSave",
      "getDataFieldByFieldId",
    ]),
    ...mapGetters("auth", ["getLogged", "getUser"]),
    isReadOnly: function () {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isBlock: function () {
      return this.$store.getters["menu/getMenuById"](this.menuId)?.LUSEBLOCK;
    },
  },
  methods: {
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        const error = data[i].error;
        if (
          (data[i].required &&
            !data[i].hidden &&
            data[i].visible &&
            (value === null || value === undefined || value === "") &&
            value !== 0) ||
          (error && data[i].visible)
        ) {
          console.log("error", data[i]);
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
          this.$store.commit("data_card/saveButtonClicked", false);
        }
      }
      return valid;
    },
    async saveCard(e = {}) {
      await this.callScript(e, "beforeSave");
      if (this.validateData(this.getForm)) {
        this.isShowSavedError = false;
        let moduleId = this.moduleId,
          itemId = this.menuId,
          cardId = this.getFormParams.idCard,
          relId = this.getFormParams.idRel,
          zone = this.zone;
        let resp = await this.$store.dispatch("data_card/saveDataCard", {
          moduleId,
          itemId,
          cardId,
          relId,
          zone,
          form: this.getForm,
        });
        if (resp.status === 200) {
          await this.$store.dispatch("data_card/fetchForm", {
            ...this.getFormParams,
            zone: this.zone,
          });
          await this.callScript(e, "afterSave");
        }
      }
    },
    async callScript(e, action = null) {
      let data = await this.eventHandler(
        this.getForm.map((a) => Object.assign({}, a)),
        e,
        action
      );
      if (data) {
        this.$store.commit("data_card/setForm", data || this.getForm);
      }
    },
    async fetchCard() {
      let { items } = await this.$store.dispatch(
        "data_card/fetchList",
        this.params
      );
      this.params.idCard = this.cardId || items[0].ID;
      this.params.idRel = this.rel || items[0].REL;
      await this.$store.dispatch("data_card/fetchForm", this.params);
    },
    async updateValue(e) {
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
      let field = this.getForm.find((f) => f.fieldId === e.fieldId);
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM === this.menuId
      );
      await this.callScript(e);
      if (field.type === "button" && e.action) {
        const actionId = parseInt(e.value.replace("Item", ""));
        const actionRefreshCard = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 39 && item.ID === actionId;
        });
        const actionSaveCard = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 38 && item.ID === actionId;
        });
        const actionExecute = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 4 && item.ID === actionId;
        });
        if (actionSaveCard?.ID === actionId) {
          let node = document.querySelector('[title="reCAPTCHA"]');
          if (node && !this.$store.getters["data_card/getRecaptchaToken"]) {
            this.$store.commit("data_card/saveButtonClicked", true);
            this.$store.commit("data_card/setUpdateEvent", e);
            this.$store.commit(
              "data_card/setUpdateValueFunction",
              this.updateValue
            );
            return;
          }
          await this.saveCard(e);
          this.$store.commit("data_card/setRecaptchaToken", null);
          this.$store.commit("data_card/saveButtonClicked", false);
        }
        if (actionRefreshCard?.ID === actionId) {
          await this.fetchCard();
        }
        if (actionExecute?.ID === actionId) {
          const response = await this.$store.dispatch(
            "data_card/executeAction",
            {
              actionId: actionExecute?.ID,
              relActionId: actionExecute?.REL,
              relId: this.rel,
              rowId: this.cardId,
              body: this.$store.getters["data_card/getActionParams"],
            }
          );
          if (response?.data) {
            if (response.data.POUTVALUE) {
              if (response.data.POUTVALUE.includes("/")) {
                window.open(response.data.POUTVALUE);
              }
            }
          }
        }
      }
    },
    updateBlurValue($event) {
      this.callScript($event, $event);
    },
  },
};
</script>

<style scoped></style>
