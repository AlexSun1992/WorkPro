<template>
  <div class="recovery-form-content">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <b-tabs @activate-tab="initData" ref="tabs">
          <b-tab title="Телефон" button-id="tab_tel_lk" id="tab_tel">
            <b-alert :show="isErrorMessage" variant="danger">{{
              errorMessage
            }}</b-alert>
            <div class="mb-3">
              Введите номер телефона указанный при регистрации
            </div>

            <verify-user
              ref="verifyUser"
              @error="showError"
              @getLoginType="loginType"
              :loginType="'phone'"
              :mode-type="'RECOVERY'"
              :v="$v.form"
              :count="60"
              :validateState="validateState"
              :text-message="textMessage"
              :tab-index="[10, 15]"
              :isError="errorMessage"
              :isCodeFieldInValid="isCodeFieldInValid"
            />

            <b-row class="mt-3" v-if="!isCodeFieldInValid">
              <b-form-group label="Дата рождения" class="col-lg-4 col-12">
                <birthday-picker
                  ref="dataPicker"
                  v-model="$v.form.birthdate.$model"
                  :state="validateState('birthdate')"
                  :tabindex="20"
                />
              </b-form-group>
              <div class="recovery col-md-8 col-12">
                <verify-password
                  v-if="!isBirthdateInValid && !isCodeFieldInValid"
                  :tab-index="[20, 30]"
                  :v="$v.form"
                  :validateState="validateState"
                  :isValid="isSamePassword"
                />
              </div>
            </b-row>
            <b-button
              v-if="isSamePassword"
              variant="primary"
              @click="resetPassword"
              :disabled="disabled"
              id="btn_change-password_tel_lk"
              class="mt-3"
              >Изменить пароль</b-button
            >
          </b-tab>
          <b-tab title="Email" button-id="tab_mail_lk" id="tab_mail">
            <b-alert :show="isErrorMessage" variant="danger">{{
              errorMessage
            }}</b-alert>
            <div class="mb-3">Введите e-mail указанный при регистрации</div>
            <verify-user
              @error="showError"
              @getLoginType="loginType"
              :loginType="'email'"
              :mode-type="'RECOVERY'"
              :v="$v.form"
              :count="60"
              :validateState="validateState"
              :tab-index="[10, 15]"
            />

            <b-row class="mt-3" v-if="!isCodeFieldInValid">
              <b-form-group label="Дата рождения" class="col-lg-4 col-12">
                <birthday-picker
                  ref="dataPicker"
                  v-model="$v.form.birthdate.$model"
                  :state="validateState('birthdate')"
                  :tabindex="20"
                />
              </b-form-group>
              <div class="recovery col-lg-8 col-12">
                <verify-password
                  v-if="!isBirthdateInValid && !isCodeFieldInValid"
                  :tab-index="[20, 30]"
                  :v="$v.form"
                  :validateState="validateState"
                  :isValid="isSamePassword"
                />
              </div>
            </b-row>
            <b-button
              v-if="isSamePassword"
              variant="primary"
              @click="resetPassword"
              :disabled="disabled"
              id="btn_change-password_mail_lk"
              class="mt-3"
              >Изменить пароль</b-button
            >
          </b-tab>
        </b-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import {
  required,
  email,
  minLength,
  sameAs,
  helpers,
} from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { BTabs, BTab, BAlert, BRow, BFormGroup, BButton } from "bootstrap-vue";
import axios from "axios";
import VerifyUser from "../Libs/VerifyUser/VerifyUser.vue";
import UserRecoveryForm from "./UserRecoveryForm.vue";
import birthdayPicker from "../Libs/BirthdatePicker/BirthdatePicker.vue";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword.vue";

const forbiddenRussianSign = helpers.regex(
  "forbiddenRussian",
  /^[^а-яА-ЯёЁ]*$/i
);

const forbiddenPlusSign = helpers.regex("forbiddenPlusSign", /^[^+]*$/i);

export default {
  layout: "MainLayout",
  components: {
    VerifyUser,
    UserRecoveryForm,
    birthdayPicker,
    VerifyPassword,
    BTabs,
    BTab,
    BAlert,
    BRow,
    BFormGroup,
    BButton,
  },
  mixins: [validationMixin],
  data() {
    return {
      form: {},
      phoneLabel: "Введите номер телефона указанный при регистрации",
      emailLabel: "Введите email указанный при регистрации",
      isEmailValid: false,
      isBirthdateValid: false,
      errorMessage: null,
      isErrorMessage: false,
      isGreater180: false,
      currentTab: 0,
      formLoaded: false,
      dateOfBirth: false,
      loginFieldType: null,
      myclass: ["cabinet okrecovery"],
    };
  },
  mounted() {
    this.initData();
    this.formLoaded = true;
  },

  methods: {
    loginType(value) {
      this.loginFieldType = value;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async resetPassword() {
      let params;
      if (this.$refs.tabs.currentTab == 0) {
        params = {
          TYPE: 1,
          PHONE: this.$v.form.phone.$model,
          SMSCODE: this.$v.form.code.$model,
          BIRTHDATE: this.$v.form.birthdate.$model,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      if (this.$refs.tabs.currentTab == 1) {
        params = {
          TYPE: 2,
          EMAIL: this.$v.form.email.$model,
          EMAILCODE: this.$v.form.code.$model,
          BIRTHDATE: this.$v.form.birthdate.$model,
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        const response = await axios.post(
          "/am/free/v2/restorepassword",
          params
        );
        if (response.data[0].MESSAGE_CODE === "200") {
          const h = this.$createElement;
          const titleVNode = h("div", {
            domProps: {
              innerHTML:
                '<img src="/export/system/modules/ru.reso.v2/resources/img/icons/icon-ok.svg"><div class="mt-3">Все получилось!</div>',
            },
          });
          const messageVNode = h("div", {
            domProps: {
              innerHTML:
                "Пароль успешно изменён,<br>теперь можно зайти в личный кабинет с новым паролем",
            },
          });
          this.$bvModal
            .msgBoxOk([messageVNode], {
              title: [titleVNode],
              size: "sm",
              buttonSize: "sm",
              okVariant: "primary",
              okTitle: "Отлично",
              centered: true,
              hideHeaderClose: false,
              modalClass: this.myclass,
              autoFocusButton: "ok",
            })
            .then((value) => {
              window.location.href = "/login";
            })
            .catch((err) => {
              console.log(err);
            });
        } else if (response.data[0].MESSAGE_CODE === "502") {
          this.isErrorMessage = true;
          this.errorMessage = "Данные неверные";
        } else if (response.data[0].MESSAGE_CODE === "501") {
          this.isErrorMessage = true;
          this.errorMessage = "Необходимо ввести дополнительные данные";
        }
      } catch (e) {
        if (e.response.data.STATUS === 500) {
          this.isErrorMessage = true;
          this.errorMessage = e.response.data.INFO;
        }
        console.log(e);
      }
    },
    initData(value) {
      if (value === 0 || value === 1) {
        this.currentTab = value;
      }
      this.form = {
        phone: "",
        code: "",
        email: "",
        surname: "",
        name: "",
        patronymic: "",
        birthdate: "",
        password: "",
        password2: "",
      };
      this.isErrorMessage = false;
      this.$v.form.$reset();
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

  computed: {
    isCodeFieldInValid() {
      return this.$v.form.code.$invalid;
    },

    isBirthdateInValid() {
      return this.$v.form.birthdate.$invalid;
    },

    isSamePassword() {
      return !this.$v.form.password2.$invalid;
    },

    tabIndex() {
      return this.currentTab == 0 ? [30, 40] : [20, 30];
    },
    disabled() {
      const loginFieldInvalid =
        this.currentTab == 0
          ? this.$v.form.phone.$invalid
          : this.$v.form.email.$invalid;
      return (
        loginFieldInvalid ||
        this.$v.form.code.$invalid ||
        this.$v.form.password.$invalid ||
        this.$v.form.password2.$invalid
      );
    },
    textMessage() {
      if (this.currentTab == 0) {
        return "Если Ваш номер телефона существует в нашей базе, то вы получите код, который нужно ввести.";
      }
      if (this.currentTab == 1) {
        return "Если ваш адрес электронной почты существует в нашей базе, то вы получите код, который нужно ввести.";
      }
    },
  },

  validations: {
    form: {
      phone: {
        required,
        minLength: minLength(17),
      },
      email: {
        required,
        email,
        forbiddenRussianSign,
        forbiddenPlusSign,
      },
      name: {
        required,
      },
      surname: {
        required,
      },
      patronymic: {
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
      birthdate: {
        required,
      },
    },
  },
};
</script>
<style scoped></style>
