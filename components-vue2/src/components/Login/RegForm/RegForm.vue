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
        <div class="col-12 col-md-6 mt-3" v-if="codeFieldValid">
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

            <b-form-invalid-feedback :state="isSurname"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isSurnameValidSigns"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>
        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
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
            <b-form-invalid-feedback :state="isName"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isNameValidSigns"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
        </div>

        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
          <b-form-group label="Отчество" label-cols="12" class="required">
            <autocomplete
              ref="autocompletePatronymic"
              placeholder="Отчество"
              :search="getSuggestionsPatronymic"
              :get-result-value="getResultValue"
              :disabled="registrationInProcess"
              :class="patronymicClass"
              @blur="handleBlur('patronymic')"
              @update="updateSuggestions"
            />

            <b-form-invalid-feedback :state="isPatronymic"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback :state="isPatronymicValidSigns"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
          </b-form-group>
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
  revealGender,
  userGender,
  getSuggestions,
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
      suggestionsHub: [],
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
      gender: "",
      isFieldsFIOEXist: false,
      //
      isPatronymic: true,
      isPatronymicTouch: false,
      isPatronymicValidSigns: true,
      //
      isName: true,
      isNameTouch: false,
      isNameValidSigns: true,
      //
      isSurname: true,
      isSurnameTouch: false,
      isSurnameValidSigns: true,
      //
      // classes
      patronymicClassHub: [],
      //
      surnameClassHub: [],
      //
      nameClassHub: [],
    };
  },

  validations: {
    form: {
      name: {
        required,
        alpha,
      },

      family: {
        required,
        alpha,
      },
      patronymic: {
        required,
        alpha,
      },
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

      policyNumber: {
        required,
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

  methods: {
    updateSuggestions(result) {
      console.log("result:", result);
    },
    handleBlur(field) {
      // Валидация
      if (field === "patronymic") {
        if (this.patronymic === "") {
          this.isPatronymic = false;
          this.patronymicClassHub.push("is-invalid");
        }
      }

      if (field === "surname") {
        if (this.family === "") {
          this.isSurname = false;
          this.surnameClassHub.push("is-invalid");
        }
      }

      if (field === "name") {
        if (this.name === "") {
          this.isName = false;
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

    async getSuggestionsPatronymic(input) {
      this.suggestionsHub = [];

      const regex = /^[а-яА-Я- ]*$/;

      if (input.length > 0) {
        if (input.match(regex) !== null) {
          this.isPatronymicTouch = true;
          this.isPatronymic = true;
          this.patronymicClassHub = [];
          this.patronymicClassHub.push("is-valid");
          this.isPatronymicValidSigns = true;
        }
        if (input.match(regex) === null) {
          this.isPatronymic = true;
          this.isPatronymicTouch = true;
          this.isPatronymicValidSigns = false;
          this.patronymicClassHub = [];
          this.patronymicClassHub.push("is-invalid");
        }
      }

      if (this.isPatronymicTouch && input === "") {
        this.isPatronymic = false;
        this.isPatronymicValidSigns = true;
        this.patronymicClassHub = [];
        this.patronymicClassHub.push("is-invalid");
      }

      const suggestionType = "fio";

      const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";

      const params = {
        query: input,
        suggestionType,
        key: API_KEY,
        parts: ["PATRONYMIC"],
      };

      const isGenderRevealed = revealGender(
        this.family,
        this.name,
        this.patronymic
      );

      if (isGenderRevealed === true) {
        this.gender = "UNKNOWN";
      }

      params.gender = this.gender;

      const isValid = this.patronymicClassHub.find(
        (item) => item === "is-valid"
      );
      const isInvalid = this.patronymicClassHub.find(
        (item) => item === "is-invalid"
      );

      if (isValid) {
        const result = await fetchSuggestions(params);

        const fetchedSuggestions = getSuggestions(result, this.suggestionsHub);

        console.log(this.suggestionsHub);

        console.log(fetchedSuggestions);

        return fetchedSuggestions;
      }

      if (isInvalid) {
        this.suggestionsHub.splice(0, this.suggestionsHub.length);
        console.log(this.suggestionsHub);
      }

      return null;
    },

    async getSuggestionsSurname(input) {
      this.suggestionsHub = [];
      const regex = /^[а-яА-Я- ]*$/;
      if (input.length > 0) {
        if (input.match(regex) !== null) {
          this.isSurnameTouch = true;
          this.isSurname = true;
          this.isSurnameValidSigns = true;
          this.surnameClassHub = [];
          this.surnameClassHub.push("is-valid");
        }
        if (input.match(regex) === null) {
          this.isSurname = true;
          this.isSurnameTouch = true;
          this.isSurnameValidSigns = false;
          this.surnameClassHub = [];
          this.surnameClassHub.push("is-invalid");
        }
      }

      if (this.isSurnameTouch && input === "") {
        this.isSurname = false;
        this.isSurnameValidSigns = true;
        this.surnameClassHub = [];
        this.surnameClassHub.push("is-invalid");
      }

      const suggestionType = "fio";

      const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";

      const params = {
        query: input,
        suggestionType,
        key: API_KEY,
        parts: ["SURNAME"],
      };

      const isGenderRevealed = revealGender(
        this.family,
        this.name,
        this.patronymic
      );

      if (isGenderRevealed === true) {
        this.gender = "UNKNOWN";
      }

      params.gender = this.gender;

      const isValid = this.surnameClassHub.find((item) => item === "is-valid");

      if (isValid) {
        const result = await fetchSuggestions(params);

        const fetchedSuggestions = getSuggestions(result, this.suggestionsHub);

        return fetchedSuggestions;
      }
      return null;
    },

    async getSuggestionsName(input) {
      this.suggestionsHub = [];

      const regex = /^[а-яА-Я- ]*$/;
      if (input.length > 0) {
        if (input.match(regex) !== null) {
          this.isNameTouch = true;
          this.isName = true;
          this.isNameValidSigns = true;
          this.nameClassHub = [];
          this.nameClassHub.push("is-valid");
        }
        if (input.match(regex) === null) {
          this.isName = true;
          this.isNameTouch = true;
          this.isNameValidSigns = false;
          this.nameClassHub = [];
          this.nameClassHub.push("is-invalid");
        }
      }

      if (this.isNameTouch && input === "") {
        this.isName = false;
        this.isNameValidSigns = true;
        this.nameClassHub = [];
        this.nameClassHub.push("is-invalid");
      }

      const suggestionType = "fio";

      const API_KEY = "7a6080c3383b4dc69e786e1cd5c88366ab58a14c";

      const params = {
        query: input,
        suggestionType,
        key: API_KEY,
        parts: ["NAME"],
      };

      const isGenderRevealed = revealGender(
        this.family,
        this.name,
        this.patronymic
      );

      if (isGenderRevealed === true) {
        this.gender = "UNKNOWN";
      }

      params.gender = this.gender;

      const isValid = this.nameClassHub.find((item) => item === "is-valid");

      if (isValid) {
        const result = await fetchSuggestions(params);
        const fetchedSuggestions = getSuggestions(result, this.suggestionsHub);
        return fetchedSuggestions;
      }

      return null;
    },

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
          SECONDNAME: this.$v.form.family.$model,
          FIRSTNAME: this.$v.form.name.$model,
          THIRDNAME: this.$v.form.patronymic.$model,
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
