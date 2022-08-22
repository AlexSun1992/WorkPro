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
            <b-form-input
              list="my-list-id"
              :id="Math.random().toString()"
              v-model="$v.form.family.$model"
              :state="validateState('family')"
              @blur="$v.form.family.$touch(), clearArray()"
              placeholder="Фамилия"
              :disabled="registrationInProcess"
              autocomplete="new-password"
              @input="askSuggestions('surname')"
            ></b-form-input>

            <b-form-invalid-feedback v-if="family === ''"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback v-if="this.$v.form.family.alpha === false"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >

            <datalist id="my-list-id">
              <option v-for="(item, index) in array" :key="index">
                {{ item }}
              </option>
            </datalist>
          </b-form-group>
        </div>
        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
          <b-form-group label="Имя" label-cols="12" class="required">
            <b-form-input
              list="my-list-id"
              :id="Math.random().toString()"
              v-model="$v.form.name.$model"
              :state="validateState('name')"
              @blur="$v.form.name.$touch(), clearArray()"
              placeholder="Имя"
              :disabled="registrationInProcess"
              autocomplete="new-password"
              @input="askSuggestions('name')"
            ></b-form-input>

            <b-form-invalid-feedback v-if="name === ''"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback v-if="this.$v.form.name.alpha === false"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
            <datalist id="my-list-id">
              <option v-for="(item, index) in array" :key="index">
                {{ item }}
              </option>
            </datalist>
          </b-form-group>
        </div>

        <div class="col-12 col-md-6 mt-2 mt-md-3" v-if="codeFieldValid">
          <b-form-group label="Отчество" label-cols="12" class="required">
            <b-form-input
              list="my-list-id"
              :id="Math.random().toString()"
              v-model="$v.form.patronymic.$model"
              :state="validateState('patronymic')"
              @blur="$v.form.patronymic.$touch(), clearArray()"
              placeholder="Отчество"
              :disabled="registrationInProcess"
              autocomplete="new-password"
              @input="askSuggestions('patronymic')"
            ></b-form-input>

            <b-form-invalid-feedback v-if="patronymic === ''"
              >Пожалуйста, заполните это поле</b-form-invalid-feedback
            >
            <b-form-invalid-feedback
              v-if="this.$v.form.patronymic.alpha === false"
              >Просьба указать ФИО в русской
              транскрипции</b-form-invalid-feedback
            >
            <datalist id="my-list-id">
              <option v-for="(item, index) in array" :key="index">
                {{ item }}
              </option>
            </datalist>
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
          <b-form-group label="Номер полиса" label-cols="12" class="required">
            <b-form-input
              :id="Math.random().toString()"
              v-model="$v.form.policyNumber.$model"
              :state="validateState('policyNumber')"
              placeholder="Номер полиса"
              :disabled="registrationInProcess"
              autocomplete="new-password"
              @blur="$v.form.policyNumber.$touch()"
            ></b-form-input>
            <b-form-invalid-feedback>
              Пожалуйста, заполните это поле
            </b-form-invalid-feedback>
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
import birthdayPicker from "../Libs/BirthdatePicker/BirthdatePicker.vue";
import VerifyUser from "../Libs/VerifyUser/VerifyUser.vue";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword.vue";
import ConfirmModal from "./ConfirmModal.vue";
import {
  BForm,
  BFormGroup,
  BFormInput,
  BFormInvalidFeedback,
  BAlert,
  BButton,
  BSpinner,
  BNav,
  BNavItem,
} from "bootstrap-vue";
import { getMessageFromSuccessResponse } from "../Libs/VerifyUser/verifyUser.helper";
import {
  createParamsForRequest,
  fetchSuggestions,
  getSuggestions,
  revealGender,
  userSurnameGender,
  userNameGender,
  userPatronymicGender,
} from "./dadata.helper";

const alpha = helpers.regex("alpha", /^[а-яА-Я- ]*$/);

export default {
  components: {
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
    BNav,
    BNavItem,
  },

  mixins: [validationMixin],

  data() {
    return {
      array: [],
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
      userSurname: "",
      userName: "",
      userPatronymic: "",
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

  computed: {
    errorReset() {
      if (!this.$v.form.name.$model) {
        console.log(this.$v.form.name.$model);
      }
    },
    family() {
      return this.$v.form.family.$model;
    },

    name() {
      return this.$v.form.name.$model;
    },

    patronymic() {
      return this.$v.form.patronymic.$model;
    },
  },

  watch: {
    family(value) {
      this.userSurname = value;
    },

    name(value) {
      this.userName = value;
    },

    patronymic(value) {
      this.userPatronymic = value;
    },
  },

  methods: {
    getTextMessage(value) {
      this.successSendMessageText = value;
    },

    isCodeFieldValid(data) {
      this.codeFieldValid = data;
    },

    clearArray() {
      this.array = [];
    },

    async askSuggestions(target) {
      const isFieldFioEmpty = revealGender(
        this.name,
        this.family,
        this.patronymic
      );

      if (isFieldFioEmpty === false) {
        this.gender = "UNKNOWN";
      }

      if (this.family === "" && this.name === "" && this.patronymic === "") {
        this.gender = "UNKNOWN";
      }

      const resultParams = createParamsForRequest(
        target,
        this.$v.form.name.$model,
        this.$v.form.family.$model,
        this.$v.form.patronymic.$model,
        this.gender
      );

      const result = await fetchSuggestions(resultParams);

      const surnameGender = userSurnameGender(result, this.family);

      if (surnameGender !== undefined) {
        this.gender = surnameGender;
      }

      const nameGender = userNameGender(result, this.name);

      if (nameGender !== undefined) {
        this.gender = nameGender;
      }

      const patonimycGender = userPatronymicGender(
        result,
        this.userPatronymicGender
      );

      if (patonimycGender !== undefined) {
        this.gender = patonimycGender;
      }

      await getSuggestions(
        target,
        result,
        this.array,
        this.$v.form.family.alpha,
        this.$v.form.name.alpha,
        this.$v.form.patronymic.alpha
      );
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
        let params = {
          SECONDNAME: this.$v.form.family.$model,
          FIRSTNAME: this.$v.form.name.$model,
          THIRDNAME: this.$v.form.patronymic.$model,
          BIRTHDATE: this.$v.form.birthdate.$model,
          PHONE: this.$v.form.phone.$model,
          CODE: this.$v.form.code.$model,
          POLICY_NUMBER: this.$v.form.policyNumber.$model,
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
