<template>
  <div>
    <ConfirmModal
      :conformation="conformation"
      @agree="isRegConfirmed = $event"
    />
    <b-form
      @submit.stop.prevent="onSubmit"
      inline
      class="align-items-start"
    >
      <div class="row">
        <div class="col-12 ph4b">1. ПЕРСОНАЛЬНЫЕ ДАННЫЕ</div>
        <div class="col-12 col-lg-4 mt-3">
          <ControlDadataSelect
            ref="surnameComponent"
            :data="surnameData"
            :edit="!isDisabledForm"
            :class="surnameClass"
            @update="changeField('family', $event)"
            data-testid="regFamily"
            :is-regform-field="true"
            :gender="gender"
            @gender-revealed="handleGenderReveal"
          />
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <ControlDadataSelect
            ref="nameComponent"
            :data="firstnameData"
            :edit="!isDisabledForm"
            :class="nameClass"
            @update="changeField('firstname', $event)"
            data-testid="regName"
            :is-regform-field="true"
            @gender-revealed="handleGenderReveal"
            :gender="gender"
          />
        </div>
        <div
          class="col-12 col-lg-4 mt-3"
          id="patronymic"
        >
          <ControlDadataSelect
            ref="patronymicComponent"
            :data="patronymicData"
            :edit="!isDisabledForm"
            :class="patronymicClass"
            @update="changeField('patronymic', $event)"
            data-testid="regPatronymic"
            @gender-revealed="handleGenderReveal"
            :is-regform-field="true"
            :gender="gender"
          />
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <form-group
            label="Дата рождения"
            label-cols="12"
            class="required"
          >
            <birthday-picker2
              id="birthday-picker"
              v-model="$v.form.birthdate.$model"
              :state="validateState('birthdate')"
              :disabled="isDisabledForm"
              @input="changeField('birthdate')"
            />
          </form-group>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <div class="checkbox-switcher custom-control custom-checkbox cs-near-l_input-lg">
            <input
              type="checkbox"
              id="policy-exist-check-box"
              class="cs-near-l_input-lg"
              :disabled="isDisabledForm"
              :checked="isPolicyExist"
              @change="changeField('isPolicyExist', $event.target.checked)"
            />
            <label for="policy-exist-check-box"> У меня есть полис РЕСО </label>
          </div>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <form-group
            label="Номер полиса"
            label-cols="12"
          >
            <b-form-input
              ref="policyNumber"
              :id="Math.random().toString()"
              :class="policyClass"
              v-model="form.policyNumber"
              placeholder="Номер полиса"
              :disabled="!isPolicyExist || isDisabledForm"
              autocomplete="new-password"
              @update="changeField('policyNumber', $event)"
              @blur="handleBlur('policyNumber')"
            ></b-form-input>
          </form-group>
          <div
            class="invalid-feedback"
            v-if="isStatePolicyErrorMessage === false"
          >
            Обязательное поле
          </div>
        </div>
        <div class="col-12 mt-4 mt-lg-0">
          <div class="h-line d-none d-lg-block"></div>
        </div>
        <div class="col-12 ph4b">2. ЗАДАЙТЕ ПАРОЛЬ</div>
        <div class="col-12">
          <verify-password
            :v="$v.form"
            :validateState="validateState"
            :disabled="isDisabledForm"
            :tab-index="[50, 60]"
            :log-params="logParams"
          />
        </div>
        <div class="col-12 mt-4 mt-lg-0">
          <div class="h-line d-none d-lg-block"></div>
        </div>
        <div class="col-12 ph4b">3. ТЕЛЕФОН</div>
        <div class="col-12 mt-3">
          <form-group class="mt-50 w-100 required">
            <verify-user
              ref="verifyUser"
              @error="showError"
              :v="$v.form"
              :log-params="logParams"
              :count="60"
              :context="'registration'"
              :loginType="'phone'"
              :mode-type="'REG'"
              :validateState="validateState"
              :disabled="isDisabledForm"
              :text-message="successSendMessageText"
              :tab-index="[10, 14, 16]"
              :error="errorMessage"
              @checkCodeFieldValid="isCodeFieldValid"
              @messageText="getTextMessage"
              @sendingCode="sendingCode"
              @sendCode="sendCode"
              :isCodeFieldValid="codeFieldValid"
              @isPhoneChangedButtonClicked="checkIfButtonClicked"
              @input="refuseButtonClicked"
              :form-data="formData"
              :is-valid-form="isValidForm"
            />
          </form-group>
        </div>
        <div
          id="error-message"
          class="col-12 invalid-feedback mt-3"
          v-if="errorMessage"
        >
          {{ errorMessage }}
        </div>
        <div class="col-12 my-4 my-lg-5">
          <div class="checkbox-hide">
            <input
              id="agreement-check-box"
              :disabled="isDisabledForm"
              :value="!isAgreement"
              @change="userConfirm"
              v-model="isAgreement"
              type="checkbox"
            />
            <label
              for="agreement-check-box"
              class="checkbox-hide"
            >
              Я даю
              <a
                href="/regulations/personal-agreement-2.html"
                class="reg_agreement"
                target="_blank"
                >согласие</a
              >
              на обработку персональных данных в соответствии с
              <a
                href="/export/sites/reso/about/polozhenie-po-pnd-21.08.2025.pdf"
                class="reg_agreement"
                target="_blank"
                >Положением</a
              >
              о порядке обработки и обеспечения безопасности персональных данных САО «РЕСО-Гарантия».
            </label>
            <div
              class="invalid-feedback"
              v-if="isErrorMessageAgreement && !isAgreement"
            >
              Необходимо согласие с обработкой персональных данных
            </div>
          </div>
          <div class="checkbox-hide mt-4">
            <input
              id="agreement-check-box_rec"
              type="checkbox"
              v-model="isAgreementRec"
              :disabled="isDisabledForm"
            />
            <label
              for="agreement-check-box_rec"
              class="checkbox-hide"
              >Я даю
              <a
                href="/about/normative/advertising-mailing-agreement.html"
                class="reg_agreement"
                target="_blank"
                >согласие</a
              >
              на получение информации о продуктах, услугах и акциях.</label
            >
          </div>
        </div>
      </div>
      <div class="row align-items-center">
        <div class="col-12 col-lg-auto">
          <button
            @click.stop.prevent="onSubmit"
            class="w-100 w-lg-auto btn-primary"
            type="submit"
            :disabled="isRegDisableButton || registrationInProcess"
            id="btn_chek_registration_lk"
          >
            Зарегистрироваться
            <span
              class="spinner-border"
              v-if="registrationInProcess"
              ><span class="sr-only"></span
            ></span>
          </button>
        </div>
        <div class="col-auto mt-3 mt-lg-0">
          <button
            @click="changeFormData"
            class="w-100 btn-change-link"
            type="submit"
            :disabled="isChangeDataDisableButton || registrationInProcess"
            id="btn_change_data_registration_lk"
          >
            Изменить данные
          </button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, helpers } from "@vuelidate/validators";
import moment from "moment";
// eslint-disable-next-line import/extensions
import { getErrorMessage } from "@/plugins/auth/toast.helper";
import birthdayPicker2 from "../Libs/BirthdatePicker/BirthdatePicker2";
import VerifyUser from "../Libs/VerifyUser2/VerifyUser2";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword";
import ConfirmModal from "./ConfirmModal";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

import {
  isGenderReveal,
  userGender,
  getSuggestions,
  isEnoughDataForGenderDefine,
  isFieldFIONotValid,
  getArrayWithClass,
  fetchPatronymic,
  fetchSurname,
  fetchName,
} from "./dadata.helper";

import { passwordValidationDetail } from "./regform.helper";
import ControlDadataSelect from "@/components/Libs/Controls/ControlDadataSelect";

const REGEX = /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;

const ERROR_MSG = {
  required: "Обязательное поле. Укажите ФИО кириллицей",
  notCyrillic: "Просьба указать ФИО в русской транскрипции",
};

export default {
  components: {
    birthdayPicker2,
    VerifyUser,
    VerifyPassword,
    ConfirmModal,
    FormGroup,
    ControlDadataSelect,
  },

  setup() {
    return { vuelidateRef: useVuelidate() };
  },

  name: "RegForm",
  data() {
    return {
      logEvent: null,
      logParams: {
        formName: "Registration",
      },
      codeFieldValid: false,
      firstname: "",
      family: "",
      patronymic: "",
      form: {
        phone: "",
        birthdate: "",
        policyNumber: "",
        code: "",
        password: "",
        password2: "",
      },
      changePhoneButtonClicked: false,
      isPatronymicNotExist: false,
      isPolicyExist: false,
      isAgreement: false,
      isAgreementRec: false,
      isErrorMessageAgreement: false,
      conformation: false,
      show: true,
      password2: "",
      registrationInProcess: false,
      captchaToken: null,
      codeToken: null,
      isRegConfirmed: null,
      token: 1,
      successSendMessageText: null,
      textMessage: "На Ваш номер телефона был отправлен код, который необходимо ввести.",
      errorMessage: null,
      isErrorMessage: false,
      myclass: ["cabinet regpopup"],
      suggestionsHub: [],
      genderHub: {
        family: "UNKNOWN",
        firstname: "UNKNOWN",
        patronymic: "UNKNOWN",
      },
      isFieldsFIOEXist: false,
      isPatronymicErrorMessage: true,
      isPatronymicTouch: false,
      isPatronymicValidSignsErrorMessage: true,
      isStatePolicyErrorMessage: null,
      isNameErrorMessage: true,
      isNameTouch: false,
      isNameValidSignsErrorMessage: true,
      isSurnameErrorMessage: true,
      isSurnameTouch: false,
      isSurnameValidSignsErrorMessage: true,
      isSendCode: false,
      isSendingCode: false,
      patronymicClassHub: [],
      policyClassHub: [],
      surnameClassHub: [],
      nameClassHub: [],
      requestToDadataParamsPartsHub: [],
    };
  },

  mounted() {
    const currentURL = window.location.pathname;
    this.$nextTick(() => {
      if (currentURL.includes("registration")) {
        this.$LogEvent({
          ...this.logParams,
          idEventType: 1,
          controlName: "RegForm.vue",
          message: "Открыли форму регистрации",
          timeUser: new Date(),
        });
      }
    });
  },
  validations() {
    return {
      form: {
        birthdate: {
          required,
        },
        code: {
          required,
          minLength: minLength(4),
        },
        password: {
          required,
          errorMessageValidation: (value) => passwordValidationDetail(value).length === 0,
        },
        password2: {
          required,
          sameAsPassword: helpers.withMessage("Пароли не совпадают", (value, siblings) => value === siblings.password),
        },
        phone: {
          required,
          minLength: minLength(17),
        },
      },
    };
  },

  updated() {
    if (this.codeFieldValid) {
      this.isFieldsFIOEXist = true;
    }
  },
  computed: {
    formData() {
      const params = {
        SECONDNAME: this.family.trim(),
        FIRSTNAME: this.firstname.trim(),
        THIRDNAME: this.patronymic.trim(),
        BIRTHDATE: this.$v.form.birthdate.$model
          ? moment(this.$v.form.birthdate.$model, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD")
          : "",
        PHONE: this.$v.form.phone.$model,
        POLICY_NUMBER: this.form.policyNumber,
        PASSWORD: this.$v.form.password.$model,
        PASSWORD_CONFIRM: this.$v.form.password2.$model,
        USER_CONFIRM: this.isAgreement ? "Y" : "N",
        CONFIRM_MARKETING: this.isAgreementRec ? "Y" : "N",
        GUID: this.codeToken,
      };
      return params;
    },
    isRegDisableButton() {
      if (this.isValidForm === true && this.codeToken !== null && this.codeFieldValid === true) {
        return false;
      }
      return true;
    },
    isChangeDataDisableButton() {
      if (this.isValidForm === true && this.codeToken !== null) {
        return false;
      }
      return true;
    },
    isValidForm() {
      if (
        this.isPolicyExist === true &&
        (this.isStatePolicyErrorMessage === false || this.isStatePolicyErrorMessage === null)
      ) {
        return false;
      }

      if (this.nameClassHub.length === 0 || this.surnameClassHub.length === 0) {
        return false;
      }
      if (
        this.nameClassHub.includes("is-invalid") ||
        this.surnameClassHub.includes("is-invalid") ||
        this.patronymicClassHub.includes("is-invalid")
      ) {
        return false;
      }
      if (!this.validateState("birthdate")) {
        return false;
      }
      if (this.form.password === "" || this.form.password2 === "") {
        return false;
      }
      if (this.$v.form.password.$error || this.$v.form.password2.$error) {
        return false;
      }
      if (this.isAgreement === false) {
        return false;
      }
      return true;
    },
    isDisabledForm() {
      if (this.registrationInProcess || this.isSendingCode || this.isSendCode) {
        return true;
      }
      return false;
    },
    patronymicClass() {
      return this.patronymicClassHub;
    },

    surnameClass() {
      return this.surnameClassHub;
    },

    nameClass() {
      return this.nameClassHub;
    },
    policyClass() {
      return this.policyClassHub;
    },

    surnameData() {
      return {
        name: "SECONDNAME",
        fieldId: "family",
        placeholder: "Фамилия",
        label: "Фамилия",
        required: true,
        value: this.family,
        state: this.surnameError,
        error: this.surnameErrorText,
      };
    },
    firstnameData() {
      return {
        name: "FIRSTNAME",
        fieldId: "firstname",
        label: "Имя",
        placeholder: "Имя",
        value: this.firstname,
        state: this.firstnameError,
        error: this.firstnameErrorText,
      };
    },
    patronymicData() {
      return {
        name: "THIRDNAME",
        fieldId: "patronymic",
        label: "Отчество (при наличии)",
        placeholder: "Отчество",
        value: this.patronymic,
        state: this.patronymicError,
        error: this.patronymicErrorText,
      };
    },

    firstnameError() {
      return this.isNameErrorMessage && this.isNameValidSignsErrorMessage;
    },
    surnameError() {
      return this.isSurnameErrorMessage && this.isSurnameValidSignsErrorMessage;
    },
    patronymicError() {
      return this.isPatronymicErrorMessage && this.isPatronymicValidSignsErrorMessage;
    },
    surnameErrorText() {
      if (this.isSurnameErrorMessage) {
        return ERROR_MSG.required;
      }
      if (this.isSurnameValidSignsErrorMessage) {
        return ERROR_MSG.notCyrillic;
      }
      return "";
    },
    firstnameErrorText() {
      if (this.isNameErrorMessage) {
        return ERROR_MSG.required;
      }
      if (this.isNameValidSignsErrorMessage) {
        return ERROR_MSG.notCyrillic;
      }
      return "";
    },
    patronymicErrorText() {
      if (this.isPatronymicErrorMessage) {
        return ERROR_MSG.required;
      }
      if (this.isPatronymicValidSignsErrorMessage) {
        return ERROR_MSG.notCyrillic;
      }
      return "";
    },
    fio() {
      return {
        firstname: this.firstname,
        family: this.family,
        patronymic: this.patronymic,
      };
    },
    gender() {
      const knownGender = [this.genderHub.family, this.genderHub.firstname, this.genderHub.patronymic].find(
        (gender) => gender !== "UNKNOWN"
      );
      return knownGender ?? "UNKNOWN";
    },
  },

  methods: {
    handleGenderReveal(gender) {
      this.genderHub[gender.name] = gender.gender;
    },
    userConfirm() {
      this.$LogEvent({
        formName: "RegForm",
        idEventType: 14,
        controlName: "RegForm.vue",
        message: `Подтвердил «Согласия на обработку» при регистрации`,
        timeUser: new Date(),
      });
    },
    sendingCode(value) {
      this.form.code = null;
      this.codeFieldValid = false;
      this.isSendingCode = value;
    },
    sendCode(value) {
      this.isSendCode = Boolean(value);
      if (this.isSendCode) {
        this.codeToken = value;
      }
    },
    changeFormData() {
      this.$LogEvent({
        formName: "RegForm",
        idEventType: 16,
        controlName: "RegForm.vue",
        message: `Нажал «Изменить данные» при регистрации`,
        timeUser: new Date(),
      });
      this.isSendCode = null;
      this.codeToken = null;
      this.codeFieldValid = false;
    },
    changeField(field, e) {
      if (field === "isPatronymicNotExist") {
        this.isPatronymicNotExist = e;
        if (this.isPatronymicNotExist === true) {
          this.patronymic = "";
          this.patronymicClassHub = [];
          this.isPatronymicValidSignsErrorMessage = null;
          this.isPatronymicErrorMessage = null;
        }
        return;
      }
      if (field === "firstname") {
        const input = e.value;

        if (!input?.length) {
          this.genderHub[field] = "UNKNOWN";
          this.isNameErrorMessage = true;
          this.isNameTouch = true;
          this.isNameValidSignsErrorMessage = false;
          getArrayWithClass(this.nameClassHub, "is-invalid");
          return;
        }

        const isInputNotValid = isFieldFIONotValid(input, REGEX);

        if (!isInputNotValid) {
          this.firstname = input;
          this.isNameTouch = true;
          this.isNameErrorMessage = true;
          this.isNameValidSignsErrorMessage = true;
          getArrayWithClass(this.nameClassHub, "is-valid");
        }
        if (isInputNotValid) {
          this.isNameErrorMessage = true;
          this.isNameTouch = true;
          this.isNameValidSignsErrorMessage = false;
          getArrayWithClass(this.nameClassHub, "is-invalid");
        }
      }
      if (field === "family") {
        const input = e.value;

        if (!input?.length) {
          this.genderHub[field] = "UNKNOWN";
          this.isSurnameErrorMessage = true;
          this.isSurnameTouch = true;
          this.isSurnameValidSignsErrorMessage = false;
          getArrayWithClass(this.surnameClassHub, "is-invalid");
          return;
        }
        const isInputNotValid = isFieldFIONotValid(input, REGEX);

        if (!isInputNotValid) {
          this.family = input;
          this.isSurnameErrorMessage = true;
          this.isSurnameTouch = true;
          this.isSurnameValidSignsErrorMessage = true;
          getArrayWithClass(this.surnameClassHub, "is-valid");
        }
        if (isInputNotValid) {
          this.isSurnameErrorMessage = true;
          this.isSurnameTouch = true;
          this.isSurnameValidSignsErrorMessage = false;

          getArrayWithClass(this.surnameClassHub, "is-invalid");
        }
      }
      if (field === "patronymic") {
        const input = e.value;

        if (!input?.length) {
          this.genderHub[field] = "UNKNOWN";
          return;
        }

        const isInputNotValid = isFieldFIONotValid(input, REGEX);

        if (!isInputNotValid) {
          this.patronymic = input;
          this.isPatronymicTouch = true;
          this.isPatronymicErrorMessage = true;
          this.isPatronymicValidSignsErrorMessage = true;
          getArrayWithClass(this.patronymicClassHub, "is-valid");
        }

        if (isInputNotValid) {
          this.isPatronymicErrorMessage = true;
          this.isPatronymicTouch = true;
          this.isPatronymicValidSignsErrorMessage = false;
          getArrayWithClass(this.patronymicClassHub, "is-invalid");
        }
      }

      if (field === "isPolicyExist") {
        this.isPolicyExist = e;
        if (this.isPolicyExist === false) {
          this.form.policyNumber = "";
          this.policyClassHub = [];
          this.isStatePolicyErrorMessage = null;
        }
        this.$LogEvent({
          formName: "RegForm",
          idEventType: 11,
          controlName: "RegForm.vue",
          message: `Переключил пункт «У меня есть полис РЕСО» при регистрации`,
          timeUser: new Date(),
        });
        return;
      }
      if (field === "policyNumber") {
        this.policyClassHub = [];
        this.isStatePolicyErrorMessage = null;
        if (e === "") {
          this.isStatePolicyErrorMessage = false;
          this.policyClassHub.push("is-invalid");
          return;
        }
        this.isStatePolicyErrorMessage = true;
        this.policyClassHub = ["is-valid"];
      }
      if (this.form[field] || this[field]) {
        this[field] = e?.value;
      }
    },
    refuseButtonClicked() {
      this.changePhoneButtonClicked = false;
    },
    async checkIfButtonClicked(data) {
      this.changePhoneButtonClicked = data;
    },
    handleBlur(field) {
      // Валидация

      if (field === "policyNumber") {
        if (this.form.policyNumber === "") {
          this.isStatePolicyErrorMessage = false;
          this.policyClassHub.push("is-invalid");
        }
        if (this.form.policyNumber !== "" && this.policyClassHub[0] === "is-valid") {
          this.$LogEvent({
            formName: "RegForm",
            idEventType: 12,
            controlName: "RegForm.vue",
            message: `Заполнил поле «Номер полиса» при регистрации`,
            timeUser: new Date(),
          });
        }
      }
    },

    getResultValue(item) {
      return item.value;
    },
    getTextMessage(value) {
      this.successSendMessageText = value;
    },

    isCodeFieldValid(value) {
      this.codeFieldValid = Boolean(value);
    },

    // запрос на подсказки по отчеству

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];

      return $dirty ? !$error : null;
    },

    async register() {
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        this.registrationInProcess = true;
        const params = {
          SECONDNAME: this.family.trim(),
          FIRSTNAME: this.firstname.trim(),
          THIRDNAME: this.patronymic.trim(),
          BIRTHDATE: moment(this.$v.form.birthdate.$model, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
          PHONE: this.$v.form.phone.$model,
          CODE: this.$v.form.code.$model,
          POLICY_NUMBER: this.form.policyNumber,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
          USER_CONFIRM: "Y",
          CONFIRM_MARKETING: this.isAgreementRec ? "Y" : "N",
          GUID: this.codeToken,
        };

        const headers = {
          headers: { recaptcha: params.token, "X-Application": "VueJS" },
        };
        const response = await axios.post("/lk/free/v2/registerUser2", params, headers);

        this.registrationInProcess = false;
        const isErrorList = Boolean(response?.data[0]?.ERRORLIST);
        const isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
        const isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;

        if (isInSystemLogin) {
          this.$bvModal
            .msgBoxConfirm("Личный кабинет с указанным номером телефона уже существует.", {
              title: "Номер уже зарегистрирован",
              size: "md",
              okVariant: "secondary",
              cancelVariant: "primary",
              okTitle: "Войти в систему",
              cancelTitle: "Восстановить пароль",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
              modalClass: this.myclass,
              autoFocusButton: "ok",
            })
            .then((value) => {
              if (value === true) {
                if (isInSystemLogin) {
                  window.location.href = "/login/password-recovery";
                }
                if (isExpiredLogin) {
                  this.isSendCode = true;
                }
              }
              if (value === false) {
                window.location.href = "/feedback";
              }
              this.loading = false;
            });
        }
        if (isErrorList === false) {
          const h = this.$createElement;
          const titleVNode = h("div", {
            domProps: {
              innerHTML:
                '<img src="/export/system/modules/ru.reso.v2/resources/img/icons/icon-ok.svg"><div id="success" class="mt-3">Все получилось!</div>',
            },
          });
          const messageVNode = h("div", {
            domProps: {
              innerHTML: "Вы успешно зарегистрированы в Личном кабинете",
            },
          });
          this.$bvModal
            .msgBoxOk([messageVNode], {
              id: "modal-reg-success",
              title: [titleVNode],
              size: "md",
              okVariant: "primary",
              okTitle: "Отлично",
              hideHeaderClose: false,
              centered: true,
              modalClass: this.myclass,
              static: true,
              autoFocusButton: "ok",
            })
            .then(() => {
              window.location.href = "/login";
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          this.isErrorMessage = true;
          this.errorMessage = response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "") ?? "Неизвестная ошибка";
        }
      } catch (e) {
        this.isErrorMessage = true;
        this.errorMessage = getErrorMessage(e?.response?.data?.MESSAGE);
        this.registrationInProcess = false;
      }
    },

    async onSubmit() {
      this.$LogEvent({
        formName: "RegForm",
        idEventType: 15,
        controlName: "RegForm.vue",
        message: `Нажал «Зарегистрироваться» при регистрации`,
        timeUser: new Date(),
      });
      try {
        if (this.isAgreement === false) {
          this.isErrorMessageAgreement = true;
        }

        this.$refs.verifyUser.loginTouchesCount = 3;
        this.$v.form.$touch();
        this.isErrorMessage = false;

        if (this.surnameClassHub.length === 0) {
          this.surnameClassHub.push("is-invalid");
          this.isSurnameErrorMessage = false;
        }

        if (this.nameClassHub.length === 0) {
          this.nameClassHub.push("is-invalid");
          this.isNameErrorMessage = false;
        }

        if (this.policyClassHub.length === 0 && this.isPolicyExist === true) {
          this.isStatePolicyErrorMessage = false;
          this.policyClassHub.push("is-invalid");
        }

        if (this.nameClassHub.length === 0 || this.surnameClassHub.length === 0) {
          return;
        }

        if (this.nameClassHub.includes("is-invalid") || this.surnameClassHub.includes("is-invalid")) {
          return;
        }

        if (
          this.nameClassHub.includes("is-invalid") ||
          this.surnameClassHub.includes("is-invalid") ||
          this.patronymicClassHub.includes("is-invalid")
        ) {
          return;
        }

        if (this.$v.form.$anyError) {
          if (this.$refs.verifyUser.isSendCode === false) {
            this.$refs.verifyUser.getCode();
            this.$refs.verifyUser.isPhoneChanged = true;
          }
          return;
        }

        await this.register();
      } catch (e) {
        console.log(e);
      }
    },
    showError(msg) {
      if (msg) {
        this.isErrorMessage = true;
        this.errorMessage = msg;
      } else {
        this.isErrorMessage = false;
        this.errorMessage = null;
      }
    },
  },
};
</script>
