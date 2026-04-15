<template>
  <div class="recovery-form-content">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <button
          v-if="visibleForm === 'email'"
          @click="toggleForm('email')"
          class="login-btn-mobile d-lg-none mb-3"
        >
          Телефон
        </button>
        <b-nav
          card-header
          tabs
          class="d-none d-lg-block"
        >
          <b-nav-item
            :link-attrs="{ id: 'tab_tel_lk' }"
            @click="toggleForm('email')"
            :active="visibleForm === 'phone'"
            >Телефон</b-nav-item
          >
          <b-nav-item
            @click="toggleForm('phone')"
            :active="visibleForm === 'email'"
            :link-attrs="{ id: 'tab_mail_lk' }"
            >Электронная почта</b-nav-item
          >
        </b-nav>
        <div
          v-if="visibleForm === 'phone'"
          class="tab-text active"
        >
          <div class="tab-mobile-block">Телефон</div>
          <verify-user
            key="phone"
            ref="verifyUser"
            @error="showError"
            :error="errorMessage"
            @getLoginType="loginType"
            :isCodeFieldValid="isCodeFieldValid"
            :loginType="'phone'"
            :mode-type="'RECOVERY'"
            :v="$v.form"
            :count="60"
            :validateState="validateState"
            :text-message="textMessage"
            :tab-index="[10, 15]"
            :isError="errorMessage"
            @isPhoneChangedButtonClicked="checkIfButtonClicked"
            @checkCodeFieldValid="setCodeFieldValid"
          />
          <div
            class="row mt-3"
            v-if="isCodeFieldValid"
          >
            <b-form-group
              label="Дата рождения"
              class="col-lg-4 col-12"
            >
              <birthday-picker2
                v-model="$v.form.birthdate.$model"
                :state="validateState('birthdate')"
              />
            </b-form-group>

            <div class="recovery col-md-8 col-12">
              <verify-password
                v-if="isCodeFieldValid"
                :tab-index="[20, 30]"
                :v="$v.form"
                :validateState="validateState"
                :isValid="isSamePassword"
              />
            </div>
          </div>
          <div
            class="col-12 invalid-feedback d-block mt-3"
            v-if="isErrorMessage"
          >
            {{ errorMessage }}
          </div>
          <button
            type="button"
            v-if="isCodeFieldValid"
            :disabled="sendButtonDisabled"
            class="btn btn-primary mt-3"
            @click="resetPassword"
            id="btn_change-password_tel_lk"
          >
            Изменить пароль
          </button>
        </div>

        <div
          v-else
          class="tab-text active"
        >
          <div class="tab-mobile-block">Электронная почта</div>
          <verify-user
            key="email"
            @error="showError"
            :error="errorMessage"
            @getLoginType="loginType"
            :loginType="'email'"
            :mode-type="'RECOVERY'"
            :v="$v.form"
            :count="60"
            :validateState="validateState"
            :isCodeFieldValid="isCodeFieldValid"
            :tab-index="[10, 15]"
            @isPhoneChangedButtonClicked="checkIfButtonClicked"
            @checkCodeFieldValid="setCodeFieldValid"
          />
          <div
            class="row mt-3"
            v-if="isCodeFieldValid"
          >
            <b-form-group
              label="Дата рождения"
              class="col-lg-4 col-12"
            >
              <birthday-picker2
                v-model="$v.form.birthdate.$model"
                :state="validateState('birthdate')"
              />
            </b-form-group>
            <div class="recovery col-lg-8 col-12">
              <verify-password
                v-if="isCodeFieldValid"
                :tab-index="[20, 30]"
                :v="$v.form"
                :validateState="validateState"
                :isValid="isSamePassword"
              />
            </div>
          </div>
          <div
            class="col-12 invalid-feedback d-block mt-3"
            v-if="isErrorMessage"
          >
            {{ errorMessage }}
          </div>

          <button
            type="button"
            v-if="isCodeFieldValid"
            :disabled="sendButtonDisabled"
            class="btn btn-primary mt-3"
            @click="resetPassword"
            id="btn_change-password_mail_lk"
          >
            Изменить пароль
          </button>
        </div>

        <button
          v-if="visibleForm === 'phone'"
          @click="toggleForm('phone')"
          class="login-btn-mobile d-lg-none mt-3"
          data-testid="btn_email"
        >
          Электронная почта
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { required, email, minLength, sameAs, helpers } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import { BFormGroup, BNav, BNavItem } from "bootstrap-vue";
import axios from "axios";
import moment from "moment/moment";
import VerifyUser from "../Libs/VerifyUser/VerifyUser.vue";
import birthdayPicker2 from "../Libs/BirthdatePicker/BirthdatePicker2.vue";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword.vue";
import { passwordValidationDetail } from "../RegForm/regform.helper";
import { redirectSuccess } from "./PasswordRecoveryForm.helper";

const forbiddenRussianSign = helpers.regex("forbiddenRussian", /^[^а-яА-ЯёЁ]*$/i);
const forbiddenPlusSign = helpers.regex("forbiddenPlusSign", /^[^+]*$/i);
const EmptyForm = {
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

export default {
  layout: "MainLayout",
  components: {
    VerifyUser,
    birthdayPicker2,
    VerifyPassword,
    BFormGroup,
    BNav,
    BNavItem,
  },
  mixins: [validationMixin],
  name: "PasswordRecoveryForm",
  data() {
    return {
      form: { ...EmptyForm },
      phoneLabel: "Введите номер телефона указанный при регистрации",
      emailLabel: "Введите электронную почту указанную при регистрации",
      isEmailValid: false,
      errorMessage: null,
      isErrorMessage: false,
      isGreater180: false,
      currentTab: 0,
      formLoaded: false,
      dateOfBirth: false,
      loginFieldType: null,
      myclass: ["cabinet okrecovery"],
      visibleForm: "phone",
      isCodeFieldValid: false,
      isPhoneCodeValid: false,
      isEmailCodeValid: false,
    };
  },
  mounted() {
    this.clearForm();
    this.formLoaded = true;
    this.$nextTick(() => {
      this.$LogEvent({
        formName: "Recovery",
        idEventType: this.visibleForm === "phone" ? 149 : 157,
        controlName: "PasswordRecoveryForm.vue",
        message: `Открыли форму восстановления пароля по ${
          this.visibleForm === "phone" ? "телефону" : "электронной почте"
        }`,
        timeUser: new Date(),
      });
    });
  },
  methods: {
    setCodeFieldValid(data) {
      if (data) {
        this.isCodeFieldValid = data;
        if (this.visibleForm === "phone") this.isPhoneCodeValid = data;
        if (this.visibleForm === "email") this.isEmailCodeValid = data;
      }
    },
    toggleForm(tabs) {
      if (this.visibleForm === tabs) {
        this.isCodeFieldValid = false;
        this.visibleForm = tabs === "phone" ? "email" : "phone";
        this.$LogEvent({
          formName: "Recovery",
          idEventType: this.visibleForm === "phone" ? 149 : 157,
          controlName: "PasswordRecoveryForm.vue",
          message: `Открыли форму восстановления пароля по ${
            this.visibleForm === "phone" ? "телефону" : "электронной почте"
          }`,
          timeUser: new Date(),
        });
      }
      if (this.visibleForm === "phone") {
        this.isCodeFieldValid = this.isPhoneCodeValid;
      }
      if (this.visibleForm === "email") {
        this.isCodeFieldValid = this.isEmailCodeValid;
      }

      if (!this.isCodeFieldValid) {
        this.$v.form.code.$reset();
      }
    },

    loginType(value) {
      this.loginFieldType = value;
    },
    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },

    async resetPassword() {
      this.$LogEvent({
        formName: "Recovery",
        idEventType: this.loginFieldType === "phone" ? 151 : 159,
        controlName: "PasswordRecoveryForm.vue",
        message: `Нажал "Изменить пароль через ${this.loginFieldType === "phone" ? "номер" : "электронную почту"}"`,
        timeUser: new Date(),
      });
      let params;
      if (this.visibleForm === "phone") {
        params = {
          TYPE: 1,
          PHONE: this.$v.form.phone.$model,
          SMSCODE: this.$v.form.code.$model,
          BIRTHDATE: moment(this.$v.form.birthdate.$model, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      if (this.visibleForm === "email") {
        params = {
          TYPE: 2,
          EMAIL: this.$v.form.email.$model,
          EMAILCODE: this.$v.form.code.$model,
          BIRTHDATE: moment(this.$v.form.birthdate.$model, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        const config = {
          headers: {
            "X-Application": "VueJS",
          },
        };
        const response = await axios.post("/am/free/v2/restorepassword", params, config);

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
              innerHTML: "Пароль успешно изменён,<br>теперь можно зайти в личный кабинет с новым паролем",
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

            .then(() => {
              window.location.href = redirectSuccess("/login");
            })
            .catch((err) => {
              console.log(err);
            });
          this.$LogEvent({
            formName: "Recovery",
            idEventType: this.loginFieldType === "phone" ? 152 : 160,
            controlName: "PasswordRecoveryForm.vue",
            message: `Новый пароль успешно установлен через ${
              this.loginFieldType === "phone" ? "номер" : "электронную почту"
            }`,
            timeUser: new Date(),
          });
        } else if (response.data[0].MESSAGE_CODE === "502") {
          this.isErrorMessage = true;
          this.errorMessage = "Данные неверные";
        } else if (response.data[0].MESSAGE_CODE === "501") {
          this.isErrorMessage = true;
          this.errorMessage = "Необходимо ввести дополнительные данные";
          this.$LogEvent({
            formName: "PasswordRecoveryForm errorMessage",
            idEventType: this.loginFieldType === "phone" ? 153 : 164,
            controlName: "PasswordRecoveryForm.vue",
            message: `Показало сообщение об ошибке на ${
              this.loginFieldType === "phone" ? "номере" : "электронной почте"
            }"`,
            timeUser: new Date(),
          });
        }
      } catch (e) {
        if (e.response.data.STATUS === 500 || e.response.data.STATUS === 520) {
          this.isErrorMessage = true;
          this.errorMessage = e.response.data.INFO;
          this.$LogEvent({
            formName: "PasswordRecoveryForm errorMessage",
            idEventType: this.loginFieldType === "phone" ? 153 : 164,
            controlName: "PasswordRecoveryForm.vue",
            message: `Показало сообщение об ошибке на ${
              this.loginFieldType === "phone" ? "номере" : "электронной почте"
            }"`,
            timeUser: new Date(),
          });
        }
        console.log(e);
      }
    },
    clearForm() {
      this.form = { ...EmptyForm };
      this.isErrorMessage = false;
      this.$v.form.$reset();
    },
    showError(msg) {
      if (msg) {
        this.isErrorMessage = true;
        this.errorMessage = msg;
        this.$LogEvent({
          formName: "PasswordRecoveryForm errorMessage",
          idEventType: this.loginFieldType ? 153 : 164,
          controlName: "PasswordRecoveryForm.vue",
          message: `Показало сообщение об ошибке на ${
            this.loginFieldType === "phone" ? "номере" : "электронной почте"
          }"`,
          timeUser: new Date(),
        });
      } else {
        this.isErrorMessage = false;
        this.errorMessage = null;
      }
    },
    async checkIfButtonClicked(data) {
      this.changePhoneButtonClicked = data;
      if (this.visibleForm === "phone") this.isPhoneCodeValid = false;
      if (this.visibleForm === "email") this.isEmailCodeValid = false;
      this.isCodeFieldValid = false;
    },
  },
  computed: {
    isSamePassword() {
      return !this.$v.form.password2.$invalid;
    },
    tabIndex() {
      return this.currentTab === 0 ? [30, 40] : [20, 30];
    },
    sendButtonDisabled() {
      return (
        Boolean(
          (this.$v.form.phone.$model || this.$v.form.email.$model) &&
            (!this.$v.form.phone.$error || !this.$v.form.email.$error) &&
            !this.$v.form.code.$error &&
            !this.$v.form.password.$invalid &&
            !this.$v.form.password2.$invalid &&
            this.$v.form.password.$model &&
            this.$v.form.birthdate.$model &&
            this.$v.form.password2.$model
        ) === false
      );
    },
    textMessage() {
      if (this.currentTab === 0) {
        return "Если Ваш номер телефона существует в нашей базе, то вы получите код, который нужно ввести.";
      }
      if (this.currentTab === 1) {
        return "Если ваш адрес электронной почты существует в нашей базе, то вы получите код, который нужно ввести.";
      }
      return undefined;
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
      birthdate: {
        required,
      },
    },
  },
};
</script>
<style scoped></style>
