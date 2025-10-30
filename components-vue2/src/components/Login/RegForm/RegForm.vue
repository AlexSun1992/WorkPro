<template>
  <div>
    <ConfirmModal
      :conformation="conformation"
      @agree="isRegConfirmed = $event"
    />
    <b-form
      @submit.stop.prevent
      @keydown.enter.prevent="onSubmit"
      inline
      class="align-items-start"
    >
      <div class="row">
        <div class="col-12 ph4b">1. ПЕРСОНАЛЬНЫЕ ДАННЫЕ</div>
        <div class="col-12 col-lg-4 mt-3">
          <b-form-group
            class="required"
            label="Фамилия"
            label-cols="12"
          >
            <autocomplete
              id="autocomplete-surname"
              autofocus
              ref="autocompleteSurname"
              :search="getSuggestionsSurname"
              :get-result-value="getResultValue"
              :disabled="isDisabledForm"
              placeholder="Фамилия"
              :class="surnameClass"
              @blur="handleBlur('surname')"
              @submit="changeField('family', $event)"
              data-testid="regFamily"
            />
            <b-form-invalid-feedback :state="isSurnameErrorMessage"
              >Обязательное поле.Укажите ФИО кириллицей</b-form-invalid-feedback
            >
            <b-form-invalid-feedback
              :state="isSurnameValidSignsErrorMessage"
              data-testid="regSurnameFeedback"
              >Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <b-form-group
            label="Имя"
            label-cols="12"
            class="required"
          >
            <autocomplete
              ref="autocompleteName"
              placeholder="Имя"
              :search="getSuggestionsName"
              :get-result-value="getResultValue"
              :disabled="isDisabledForm"
              :class="nameClass"
              @blur="handleBlur('name')"
              @submit="changeField('name', $event)"
              data-testid="regName"
            />
            <b-form-invalid-feedback :state="isNameErrorMessage"
              >Обязательное поле.Укажите ФИО кириллицей</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isNameValidSignsErrorMessage"
              >Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div
          class="col-12 col-lg-4 mt-3"
          id="patronymic"
        >
          <b-form-group
            label="Отчество (при наличии)"
            label-cols="12"
            class="required"
          >
            <autocomplete
              ref="autocompletePatronymic"
              placeholder="Отчество"
              :search="getSuggestionsPatronymic"
              :get-result-value="getResultValue"
              :class="patronymicClassHub"
              :disabled="isPatronymicNotExist || isDisabledForm"
              @blur="handleBlur('patronymic')"
              @submit="changeField('patronymic', $event)"
              data-testid="regPatronymic"
            />
            <b-form-invalid-feedback :state="isPatronymicErrorMessage"
              >Обязательное поле.Укажите ФИО кириллицей</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isPatronymicValidSignsErrorMessage"
              >Просьба указать ФИО в русской транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <b-form-group
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
          </b-form-group>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <b-form-checkbox
            id="policy-exist-check-box"
            class="checkbox-switcher cs-near-l_input-lg"
            :disabled="isDisabledForm"
            v-model="isPolicyExist"
            :value="!isPolicyExist"
            @change="changeField('isPolicyExist', $event)"
          >
            У меня есть полис РЕСО
          </b-form-checkbox>
        </div>
        <div class="col-12 col-lg-4 mt-3">
          <b-form-group
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
          </b-form-group>
          <b-form-invalid-feedback :state="isStatePolicyErrorMessage">Обязательное поле</b-form-invalid-feedback>
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
          <b-form-group class="mt-50 w-100 required">
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
          </b-form-group>
        </div>
        <div
          id="error-message"
          class="col-12 invalid-feedback d-block mt-3"
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
              v-if="!isErrorMessageAgreement || isAgreement"
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
          <b-button
            @click.stop.prevent="onSubmit"
            class="w-100 w-lg-auto"
            type="submit"
            variant="primary"
            :disabled="isRegDisableButton || registrationInProcess"
            id="btn_chek_registration_lk"
          >
            Зарегистрироваться
            <b-spinner
              v-if="registrationInProcess"
              style="width: 1.2rem; height: 1.2rem"
              variant="light"
            ></b-spinner>
          </b-button>
        </div>
        <div class="col-auto mt-3 mt-lg-0">
          <b-button
            @click="changeFormData"
            class="w-100"
            type="submit"
            variant="change-link"
            :disabled="isChangeDataDisableButton || registrationInProcess"
            id="btn_change_data_registration_lk"
          >
            Изменить данные
          </b-button>
        </div>
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, helpers } from "vuelidate/lib/validators";
import { BFormGroup, BButton } from "bootstrap-vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import moment from "moment";

// eslint-disable-next-line import/extensions
import { getErrorMessage } from "@/plugins/auth/toast.helper";
import birthdayPicker2 from "../Libs/BirthdatePicker/BirthdatePicker2";
import VerifyUser from "../Libs/VerifyUser2/VerifyUser2";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword";
import ConfirmModal from "./ConfirmModal";

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

export default {
  components: {
    Autocomplete,
    birthdayPicker2,
    VerifyUser,
    VerifyPassword,
    ConfirmModal,
    BFormGroup,
    BButton,
  },

  mixins: [validationMixin],

  data() {
    return {
      logEvent: null,
      logParams: {
        formName: "Registration",
      },
      codeFieldValid: false,
      name: "",
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
      //
      suggestionsHub: [],
      gender: "",
      isFieldsFIOEXist: false,
      //
      isPatronymicErrorMessage: true,
      isPatronymicTouch: false,
      isPatronymicValidSignsErrorMessage: true,
      //
      isStatePolicyErrorMessage: null,
      isNameErrorMessage: true,
      isNameTouch: false,
      isNameValidSignsErrorMessage: true,
      //
      isSurnameErrorMessage: true,
      isSurnameTouch: false,
      isSurnameValidSignsErrorMessage: true,
      isSendCode: false,
      isSendingCode: false,
      //
      // classes
      patronymicClassHub: [],
      policyClassHub: [],
      //
      surnameClassHub: [],
      //
      nameClassHub: [],
      //
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
  validations: {
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
        sameAsPassword: sameAs("password"),
      },
      phone: {
        required,
        minLength: minLength(17),
      },
    },
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
        FIRSTNAME: this.name.trim(),
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
    errorReset() {
      if (!this.$v.form.name.$model) {
        console.log(this.$v.form.name.$model);
      }
      return {};
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
  },
  methods: {
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
          this.$refs.autocompletePatronymic.value = null;
          this.patronymicClassHub = [];
          this.isPatronymicValidSignsErrorMessage = null;
          this.isPatronymicErrorMessage = null;
        }
        return;
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
      if (field === "surname") {
        if (this.family === "") {
          this.isSurnameErrorMessage = false;
          this.surnameClassHub.push("is-invalid");
        }
      }

      if (field === "name") {
        if (this.name === "") {
          this.isNameErrorMessage = false;
          this.nameClassHub.push("is-invalid");
        }
      }

      if (field === "patronymic") {
        return;
      }

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

      // Определение пола пользователя
      // surnameGender
      const surname = userGender(this.suggestionsHub, this.family);
      if (surname !== undefined) {
        this.gender = surname;
      }

      // nameGender
      const name = userGender(this.suggestionsHub, this.name);
      if (name !== undefined) {
        this.gender = name;
      }

      // patronymicGender
      const patronymic = userGender(this.suggestionsHub, this.patronymic);
      if (patronymic !== undefined) {
        this.gender = patronymic;
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
    async getSuggestionsPatronymic(input) {
      this.suggestionsHub = [];

      if (this.patronymic === "") {
        this.suggestionsHub = [];
      }
      if (input === "") {
        this.patronymic = input;
        this.patronymicClassHub = [];
        this.isPatronymicErrorMessage = null;
        this.isPatronymicValidSignsErrorMessage = null;
        return;
      }
      const regex = /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (input.charAt(0) === " ") {
          input = "";
          this.$refs.autocompletePatronymic.value = "";
          this.patronymicClassHub = [];
          this.isPatronymicErrorMessage = true;
          return;
        }

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

      if (this.isPatronymicTouch && input === "") {
        this.patronymic = input;
        this.isPatronymicErrorMessage = false;
        this.isPatronymicValidSignsErrorMessage = true;
        this.patronymicClassHub = [];
        getArrayWithClass(this.patronymicClassHub, "is-invalid");
      }

      const isGenderRevealed = isGenderReveal(this.family, this.name, this.patronymic);

      const isGenderDefine = isEnoughDataForGenderDefine(this.family, this.name);

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getPatronymicSuggestions = await fetchPatronymic(input, this.gender, isInputNotValid);

      const fetchedSuggestions = getSuggestions(getPatronymicSuggestions, this.suggestionsHub, this.patronymic);

      return fetchedSuggestions;
    },

    // Запрос на подсказки по фамилии
    async getSuggestionsSurname(input) {
      this.suggestionsHub = [];
      const regex = /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (input.charAt(0) === " ") {
          input = "";
          this.$refs.autocompleteSurname.value = "";
          this.surnameClassHub = [];
          this.isSurnameErrorMessage = true;
          return;
        }

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

      if (this.isSurnameTouch && input === "") {
        this.family = input;
        this.isSurnameErrorMessage = false;
        this.isSurnameValidSignsErrorMessage = true;
        this.suggestionsHub = [];
        getArrayWithClass(this.surnameClassHub, "is-invalid");
      }

      const isGenderRevealed = isGenderReveal(this.family, this.name, this.patronymic);

      const isGenderDefine = isEnoughDataForGenderDefine(this.name, this.patronymic);

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getSurnameSuggestions = await fetchSurname(input, this.gender, isInputNotValid);

      const fetchedSuggestions = getSuggestions(getSurnameSuggestions, this.suggestionsHub, this.family);

      return fetchedSuggestions;
    },
    //

    // Запрос на подсказки по именам
    async getSuggestionsName(input) {
      this.suggestionsHub = [];
      const regex = /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (input.charAt(0) === " ") {
          input = "";
          this.$refs.autocompleteName.value = "";
          this.nameClassHub = [];
          this.isNameErrorMessage = true;
          return;
        }

        if (!isInputNotValid) {
          this.name = input;
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

      if (this.isNameTouch && input === "") {
        this.name = input;
        this.isNameErrorMessage = false;
        this.isNameValidSignsErrorMessage = true;
        this.suggestionsHub = [];
        getArrayWithClass(this.nameClassHub, "is-invalid");
      }

      const isGenderRevealed = isGenderReveal(this.family, this.name, this.patronymic);

      const isGenderDefine = isEnoughDataForGenderDefine(this.family, this.patronymic);

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getNameSuggestions = await fetchName(input, this.gender, isInputNotValid);
      const fetchedSuggestions = getSuggestions(getNameSuggestions, this.suggestionsHub, this.name);

      return fetchedSuggestions;
    },
    //
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
          FIRSTNAME: this.name.trim(),
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
        const response = await axios.post("/am/free/v2/registerUser2", params, headers);

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

    async onSubmit(event) {
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
