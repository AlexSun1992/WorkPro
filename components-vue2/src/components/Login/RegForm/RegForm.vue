<template>
  <div>
    <ConfirmModal
      :conformation="conformation"
      @agree="isRegConfirmed = $event"
    />
    <b-alert :show="!!errorMessage" variant="danger">{{
      errorMessage
    }}</b-alert>

    <b-form
      @submit.stop.prevent
      @keydown.enter.prevent="onSubmit"
      inline
      class="align-items-start"
    >
      <b-form-group label="Телефон" class="w-100 required">
        <verify-user
          ref="verifyUser"
          @error="showError"
          :v="$v.form"
          :count="60"
          :context="'registration'"
          :loginType="'phone'"
          :mode-type="'REG'"
          :validateState="validateState"
          :disabled="registrationInProcess"
          :text-message="successSendMessageText"
          :tab-index="[10, 14, 16]"
          :error="errorMessage"
          @checkCodeFieldValid="isCodeFieldValid"
          @messageText="getTextMessage"
        />
      </b-form-group>
      <div class="row">
        <div class="col-12 col-md-6 mt-2" v-if="codeFieldValid">
          <b-form-group class="required" label="Фамилия" label-cols="12">
            <autocomplete
              ref="autocompleteSurname"
              :search="getSuggestionsSurname"
              :get-result-value="getResultValue"
              :disabled="registrationInProcess"
              placeholder="Фамилия"
              :class="surnameClass"
              @blur="handleBlur('surname')"
            />

            <b-form-invalid-feedback :state="isSurnameErrorMessage"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isSurnameValidSignsErrorMessage"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div class="col-12 col-md-6 mt-2" v-if="codeFieldValid">
          <b-form-group label="Имя" label-cols="12" class="required">
            <autocomplete
              ref="autocompleteName"
              placeholder="Имя"
              :search="getSuggestionsName"
              :get-result-value="getResultValue"
              :disabled="registrationInProcess"
              :class="nameClass"
              @blur="handleBlur('name')"
            />
            <b-form-invalid-feedback :state="isNameErrorMessage"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isNameValidSignsErrorMessage"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
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
              :disabled="isUserPatronymicNotExist === true"
              :class="patronymicClass"
              @blur="handleBlur('patronymic')"
            />
            <!-- registrationInProcess || -->
            <!-- <b-form-invalid-feedback :state="isPatronymicErrorMessage"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            > -->

            <b-form-invalid-feedback :state="isPatronymicValidSignsErrorMessage"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div class="col-12 col-md-6 mt-md-3 pt-md-4" v-if="codeFieldValid">
          <b-form-checkbox
            class="checkbox-hide mt-3 pt-1"
            v-model="isPatronymicNotExist"
            :value="!isPatronymicNotExist"
          >
            Нет отчества
          </b-form-checkbox>
          <!-- class="checkbox-hide mt-3 pt-1"
            v-model="isPatronymicNotExist"
            :value="false" -->
        </div>

        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
          <b-form-group label="Дата рождения" label-cols="12" class="required">
            <birthday-picker
              v-model="$v.form.birthdate.$model"
              :state="validateState('birthdate')"
              :disabled="registrationInProcess"
            />
          </b-form-group>
        </div>
        <div class="col-12 col-md-6 mt-3" v-if="codeFieldValid">
          <b-form-group label="Номер полиса (Необязательное)" label-cols="12">
            <b-form-input
              :id="Math.random().toString()"
              v-model="form.policyNumber"
              placeholder="Номер полиса"
              :disabled="registrationInProcess"
              autocomplete="new-password"
            ></b-form-input>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6"></div>
        <div class="col-12" v-if="codeFieldValid">
          <verify-password
            :v="$v.form"
            :validateState="validateState"
            :disabled="registrationInProcess"
            :tab-index="[50, 60]"
          />
        </div>
        <div class="col-12 pt-3">
          <b-button
            v-if="codeFieldValid"
            @click.stop.prevent="onSubmit"
            class="w-100"
            type="submit"
            variant="primary"
            :disabled="registrationInProcess"
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
      </div>
    </b-form>
  </div>
</template>

<script>
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, minLength, sameAs, helpers } from "vuelidate/lib/validators";
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BAlert,
  BButton,
  BSpinner,
} from "bootstrap-vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import birthdayPicker from "../Libs/BirthdatePicker/BirthdatePicker.vue";
import VerifyUser from "../Libs/VerifyUser/VerifyUser.vue";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword.vue";
import ConfirmModal from "./ConfirmModal.vue";
import { getMessageFromSuccessResponse } from "../Libs/VerifyUser/verifyUser.helper";

import {
  fetchSuggestions,
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

const alpha = helpers.regex("alpha", /^[а-яА-Я- ]*$/);

export default {
  components: {
    Autocomplete,
    birthdayPicker,
    VerifyUser,
    VerifyPassword,
    ConfirmModal,
    BForm,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
    BAlert,
    BButton,
    BSpinner,
  },

  mixins: [validationMixin],

  data() {
    return {
      codeFieldValid: false,
      form: {
        phone: "",
        family: "",
        name: "",
        patronymic: "",
        birthdate: "",
        policyNumber: "",
        code: "",
        password: "",
        password2: "",
      },
      isPatronymicNotExist: false,
      conformation: false,
      show: true,
      password2: "",
      registrationInProcess: false,
      captchaToken: null,
      isRegConfirmed: null,
      token: 1,
      successSendMessageText: null,
      textMessage:
        "На Ваш номер телефона был отправлен код, который необходимо ввести.",
      errorMessage: null,
      isErrorMessage: false,
      myclass: ["cabinet"],
      //
      suggestionsHub: [],
      gender: "",
      isFieldsFIOEXist: false,
      //
      isPatronymicErrorMessage: true,
      isPatronymicTouch: false,
      isPatronymicValidSignsErrorMessage: true,
      //
      isNameErrorMessage: true,
      isNameTouch: false,
      isNameValidSignsErrorMessage: true,
      //
      isSurnameErrorMessage: true,
      isSurnameTouch: false,
      isSurnameValidSignsErrorMessage: true,
      //
      // classes
      patronymicClassHub: [],
      //
      surnameClassHub: [],
      //
      nameClassHub: [],
      //
      requestToDadataParamsPartsHub: [],
    };
  },

  validations: {
    form: {
      birthdate: {
        required,
      },
      code: {
        required,
        minLength: minLength(5),
      },
      password: {
        required,
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
    errorReset() {
      if (!this.$v.form.name.$model) {
        console.log(this.$v.form.name.$model);
      }
    },

    isUserPatronymicNotExist() {
      if (this.isPatronymicNotExist === true) {
        return true;
      }
      return false;
    },

    family() {
      if (this.codeFieldValid) {
        if (this.isFieldsFIOEXist) {
          return this.$refs.autocompleteSurname.value;
        }
      }
      return false;
    },

    name() {
      if (this.codeFieldValid) {
        if (this.isFieldsFIOEXist) {
          return this.$refs.autocompleteName.value;
        }
      }
      return false;
    },

    patronymic() {
      if (this.codeFieldValid) {
        if (this.isFieldsFIOEXist) {
          return this.$refs.autocompletePatronymic.value;
        }
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
  },

  watch: {
    isPatronymicNotExist(value) {
      if (value) {
        this.$refs.autocompletePatronymic.value = "";
      }
    },
  },

  methods: {
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

    isCodeFieldValid(data) {
      this.codeFieldValid = data;
    },

    // запрос на подсказки по отчеству

    async getSuggestionsPatronymic(input) {
      this.suggestionsHub = [];

      // инвалидация массива с подсказками при очищении поля
      if (this.patronymic === "") {
        this.suggestionsHub = [];
      }
      const regex = /^[а-яА-Я- ]*$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (!isInputNotValid) {
          this.isPatronymicTouch = true;
          this.isPatronymicErrorMessage = true;
          this.isPatronymicValidSignsErrorMessage = true;
        }

        if (isInputNotValid) {
          this.isPatronymicErrorMessage = true;
          this.isPatronymicTouch = true;
          this.isPatronymicValidSignsErrorMessage = false;
          getArrayWithClass(this.patronymicClassHub, "is-invalid");
        }
      }

      if (this.isPatronymicTouch && input === "") {
        this.isPatronymicErrorMessage = false;
        this.isPatronymicValidSignsErrorMessage = true;
        this.patronymicClassHub = [];
      }

      const isGenderRevealed = isGenderReveal(
        this.family,
        this.name,
        this.patronymic
      );

      const isGenderDefine = isEnoughDataForGenderDefine(
        this.family,
        this.name
      );

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getPatronymicSuggestions = await fetchPatronymic(
        input,
        this.gender,
        isInputNotValid
      );

      const fetchedSuggestions = getSuggestions(
        getPatronymicSuggestions,
        this.suggestionsHub,
        this.patronymic
      );

      return fetchedSuggestions;
    },
    //

    // Запрос на подсказки по фамилии
    async getSuggestionsSurname(input) {
      this.suggestionsHub = [];
      // инвалидация массива с подсказками при очищении поля

      const regex = /^[а-яА-Я- ]*$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (!isInputNotValid) {
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
        this.isSurnameErrorMessage = false;
        this.isSurnameValidSignsErrorMessage = true;
        this.suggestionsHub = [];
        getArrayWithClass(this.surnameClassHub, "is-invalid");
      }

      const isGenderRevealed = isGenderReveal(
        this.family,
        this.name,
        this.patronymic
      );

      const isGenderDefine = isEnoughDataForGenderDefine(
        this.name,
        this.patronymic
      );

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getSurnameSuggestions = await fetchSurname(
        input,
        this.gender,
        isInputNotValid
      );

      const fetchedSuggestions = getSuggestions(
        getSurnameSuggestions,
        this.suggestionsHub,
        this.family
      );

      return fetchedSuggestions;
    },
    //

    // Запрос на подсказки по именам
    async getSuggestionsName(input) {
      this.suggestionsHub = [];
      // инвалидация массива с подсказками при очищении поля

      const regex = /^[а-яА-Я- ]*$/;
      const isInputNotValid = isFieldFIONotValid(input, regex);
      if (input.length > 0) {
        if (!isInputNotValid) {
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
        this.isNameErrorMessage = false;
        this.isNameValidSignsErrorMessage = true;
        this.suggestionsHub = [];
        getArrayWithClass(this.nameClassHub, "is-invalid");
      }

      const isGenderRevealed = isGenderReveal(
        this.family,
        this.name,
        this.patronymic
      );

      const isGenderDefine = isEnoughDataForGenderDefine(
        this.family,
        this.patronymic
      );

      if (isGenderRevealed === false || isGenderDefine === false) {
        this.gender = "UNKNOWN";
      }

      const getNameSuggestions = await fetchName(
        input,
        this.gender,
        isInputNotValid
      );
      const fetchedSuggestions = getSuggestions(
        getNameSuggestions,
        this.suggestionsHub,
        this.name
      );

      return fetchedSuggestions;
    },
    //
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];

      return $dirty ? !$error : null;
    },

    async register(context) {
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        this.registrationInProcess = true;
        const params = {
          SECONDNAME: this.family,
          FIRSTNAME: this.name,
          THIRDNAME: this.patronymic,
          BIRTHDATE: this.$v.form.birthdate.$model,
          PHONE: this.$v.form.phone.$model,
          CODE: this.$v.form.code.$model,
          POLICY_NUMBER: this.form.policyNumber,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
          USER_CONFIRM: "Y",
        };

        const headers = {
          headers: { recaptcha: params.token },
        };
        const response = await axios.post(
          "/free/v2/registration",
          params,
          headers
        );

        this.registrationInProcess = false;
        if (response?.status === 200) {
          const messageAfterSuccessRegistration =
            getMessageFromSuccessResponse(response);
          this.$bvModal
            .msgBoxOk(`${messageAfterSuccessRegistration}`, {
              title: "Подтверждение",
              size: "md",
              buttonSize: "md",
              okVariant: "success",
              okTitle: "Войти в систему",
              footerClass: "p-2",
              hideHeaderClose: false,
              centered: true,
              modalClass: this.myclass,
              autoFocusButton: "ok",
            })
            .then((value) => {
              window.location.href = "/login";
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (response?.status !== 200) {
          this.isErrorMessage = true;
          this.errorMessage = response.data.INFO;
        }
      } catch (e) {
        this.isErrorMessage = true;
        this.errorMessage = e.response.data.INFO;
        this.registrationInProcess = false;
        console.log(e);
      }
    },

    async onSubmit(event) {
      try {
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

        if (
          this.nameClassHub.length === 0 ||
          this.surnameClassHub.length === 0
        ) {
          return;
        }

        if (
          this.nameClassHub.includes("is-invalid") ||
          this.surnameClassHub.includes("is-invalid")
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

        this.register(this);
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

<style scoped lang="scss"></style>
