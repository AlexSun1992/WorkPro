<template>
  <div class="recovery-form-content">
    <div class="row justify-content-center">
      <div class="col-12 col-lg-8">
        <button
          v-if="visibleForm === 'email'"
          class="login-btn-mobile d-lg-none mb-3"
          @click="toggleForm('phone')"
        >
          Телефон
        </button>
        <ul class="nav d-none d-lg-block nav-tabs card-header-tabs">
          <li
            class="nav-item"
            @click="toggleForm('phone')"
          >
            <a
              id="tab_tel_lk"
              href="#"
              :class="['nav-link active', visibleForm === 'phone' ? 'active' : '']"
              >Телефон</a
            >
          </li>
          <li
            class="nav-item"
            @click="toggleForm('email')"
          >
            <a
              id="tab_mail_lk"
              data-v-ccd7886a=""
              href="#"
              :class="['nav-link', visibleForm !== 'phone' ? 'active' : '']"
              >Электронная почта</a
            >
          </li>
        </ul>

        <div
          v-if="visibleForm === 'phone'"
          class="tab-text active"
        >
          <div class="tab-mobile-block">Телефон</div>
          <verify-user
            key="phone"
            ref="verifyUser"
            :error="errorMessage"
            :is-code-field-valid="isCodeFieldValid"
            login-type="phone"
            mode-type="RECOVERY"
            :v="$v.form"
            :count="60"
            :validate-state="validateState"
            :text-message="textMessage"
            :tab-index="[10, 15]"
            :is-error="errorMessage"
            @error="showError"
            @getLoginType="loginType"
            @isPhoneChangedButtonClicked="checkIfButtonClicked"
            @checkCodeFieldValid="setCodeFieldValid"
          />
          <div
            v-if="isCodeFieldValid"
            class="row mt-3"
          >
            <form-group
              label="Дата рождения"
              class="col-lg-4 col-12"
            >
              <birthday-picker2
                v-model="$v.form.birthdate.$model"
                :state="validateState('birthdate')"
              />
            </form-group>

            <div class="recovery col-md-8 col-12">
              <verify-password
                v-if="isCodeFieldValid"
                :tab-index="[20, 30]"
                :v="$v.form"
                :validate-state="validateState"
                :is-valid="isSamePassword"
              />
            </div>
          </div>
          <div
            v-if="isErrorMessage"
            class="col-12 invalid-feedback mt-3"
          >
            {{ errorMessage }}
          </div>
          <button
            v-if="isCodeFieldValid"
            id="btn_change-password_tel_lk"
            type="button"
            :disabled="sendButtonDisabled"
            class="btn btn-primary mt-3"
            @click="resetPassword"
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
            :error="errorMessage"
            login-type="email"
            mode-type="RECOVERY"
            :v="$v.form"
            :count="60"
            :validate-state="validateState"
            :is-code-field-valid="isCodeFieldValid"
            :tab-index="[10, 15]"
            @error="showError"
            @getLoginType="loginType"
            @isPhoneChangedButtonClicked="checkIfButtonClicked"
            @checkCodeFieldValid="setCodeFieldValid"
          />
          <div
            v-if="isCodeFieldValid"
            class="row mt-3"
          >
            <form-group
              label="Дата рождения"
              class="col-lg-4 col-12"
            >
              <birthday-picker2
                v-model="$v.form.birthdate.$model"
                :state="validateState('birthdate')"
              />
            </form-group>
            <div class="recovery col-lg-8 col-12">
              <verify-password
                v-if="isCodeFieldValid"
                :tab-index="[20, 30]"
                :v="$v.form"
                :validate-state="validateState"
                :is-valid="isSamePassword"
              />
            </div>
          </div>
          <div
            v-if="isErrorMessage"
            class="col-12 invalid-feedback mt-3"
          >
            {{ errorMessage }}
          </div>

          <button
            v-if="isCodeFieldValid"
            id="btn_change-password_mail_lk"
            type="button"
            :disabled="sendButtonDisabled"
            class="btn btn-primary mt-3"
            @click="resetPassword"
          >
            Изменить пароль
          </button>
        </div>

        <button
          v-if="visibleForm === 'phone'"
          class="login-btn-mobile d-lg-none mt-3"
          data-testid="btn_email"
          @click="toggleForm('email')"
        >
          Электронная почта
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email, minLength, helpers } from "@vuelidate/validators";
import axios from "axios";
import moment from "moment/moment";
import VerifyUser from "../Libs/VerifyUser/VerifyUser";
import birthdayPicker2 from "../Libs/BirthdatePicker/BirthdatePicker2";
import VerifyPassword from "../Libs/VerifyPassword/VerifyPassword";
import { passwordValidationDetail } from "../RegForm/regform.helper";
import { redirectSuccess } from "./PasswordRecoveryForm.helper";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

const forbiddenRussianSign = helpers.regex(/^[^а-яА-ЯёЁ]*$/i);
const forbiddenPlusSign = helpers.regex(/^[^+]*$/i);
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
  name: "PasswordRecoveryForm",
  components: {
    VerifyUser,
    birthdayPicker2,
    VerifyPassword,
    FormGroup,
  },
  layout: "MainLayout",
  setup() {
    return { vuelidateRef: useVuelidate() };
  },
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
  computed: {
    getDefaultIndex() {
      return this.visibleForm === "phone" ? 0 : 1;
    },
    isSamePassword() {
      return !this.$v.form.password2.$invalid;
    },
    tabIndex() {
      return this.currentTab === 0 ? [30, 40] : [20, 30];
    },
    sendButtonDisabled() {
      return !(
        (this.$v.form.phone.$model || this.$v.form.email.$model) &&
        (!this.$v.form.phone.$error || !this.$v.form.email.$error) &&
        !this.$v.form.code.$error &&
        !this.$v.form.password.$invalid &&
        !this.$v.form.password2.$invalid &&
        this.$v.form.password.$model &&
        this.$v.form.birthdate.$model &&
        this.$v.form.password2.$model
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
  mounted() {
    this.clearForm();
    this.formLoaded = true;
    this.$nextTick(() => {
      this.sendLog({
        idEventType: this.visibleForm === "phone" ? 149 : 157,
        message: `Открыли форму восстановления пароля по ${
          this.visibleForm === "phone" ? "телефону" : "электронной почте"
        }`,
      });
    });
  },
  methods: {
    sendLog({ idEventType, message, formName = "Recovery", controlName = "PasswordRecoveryForm.vue" }) {
      this.$LogEvent({
        idEventType,
        message,
        formName,
        controlName,
        timeUser: new Date(),
      });
    },
    setCodeFieldValid(data) {
      if (data) {
        this.isCodeFieldValid = data;
        if (this.visibleForm === "phone") {
          this.isPhoneCodeValid = data;
        }
        if (this.visibleForm === "email") {
          this.isEmailCodeValid = data;
        }
      }
    },
    onTabChange(index) {
      const newForm = index === 0 ? "phone" : "email";
      if (this.visibleForm === newForm) {
        return;
      }
      this.visibleForm = newForm;
      this.isCodeFieldValid = newForm === "phone" ? this.isPhoneCodeValid : this.isEmailCodeValid;

      if (!this.isCodeFieldValid) {
        this.$v.form.code.$reset();
      }

      this.sendLog({
        idEventType: this.visibleForm === "phone" ? 149 : 157,
        message: `Открыли форму восстановления пароля по ${
          this.visibleForm === "phone" ? "телефону" : "электронной почте"
        }`,
      });
    },
    toggleForm(tabs) {
      if (this.visibleForm !== tabs) {
        this.isCodeFieldValid = false;
        this.visibleForm = tabs;
        this.sendLog({
          idEventType: this.visibleForm === "phone" ? 149 : 157,
          message: `Открыли форму восстановления пароля по ${
            this.visibleForm === "phone" ? "телефону" : "электронной почте"
          }`,
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
      if (!this.$v?.form?.[name]) {
        return null;
      }
      const { $dirty, $error } = this.$v?.form?.[name];
      return $dirty ? !$error : null;
    },

    async resetPassword() {
      this.sendLog({
        idEventType: this.loginFieldType === "phone" ? 151 : 159,
        message: `Нажал "Изменить пароль через ${this.loginFieldType === "phone" ? "номер" : "электронную почту"}"`,
      });
      const params = {
        BIRTHDATE: moment(this.$v.form.birthdate.$model, ["DD.MM.YYYY", "YYYY-MM-DD"]).format("YYYY-MM-DD"),
        PASSWORD: this.$v.form.password.$model,
        PASSWORD_CONFIRM: this.$v.form.password2.$model,
      };
      if (this.visibleForm === "phone") {
        params.TYPE = 1;
        params.PHONE = this.$v.form.phone.$model;
        params.SMSCODE = this.$v.form.code.$model;
      }
      if (this.visibleForm === "email") {
        params.TYPE = 2;
        params.EMAIL = this.$v.form.email.$model;
        params.EMAILCODE = this.$v.form.code.$model;
      }
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        const config = {
          headers: {
            "X-Application": "VueJS",
          },
        };
        const response = await axios.post("/lk/free/v2/restorepassword", params, config);

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
          this.sendLog({
            idEventType: this.loginFieldType === "phone" ? 152 : 160,
            message: `Новый пароль успешно установлен через ${
              this.loginFieldType === "phone" ? "номер" : "электронную почту"
            }`,
          });
        } else if (response.data[0].MESSAGE_CODE === "502") {
          this.isErrorMessage = true;
          this.errorMessage = "Данные неверные";
        } else if (response.data[0].MESSAGE_CODE === "501") {
          this.isErrorMessage = true;
          this.errorMessage = "Необходимо ввести дополнительные данные";
          this.sendLog({
            idEventType: this.loginFieldType === "phone" ? 153 : 164,
            message: `Показало сообщение об ошибке на ${
              this.loginFieldType === "phone" ? "номере" : "электронной почте"
            }`,
          });
        }
      } catch (e) {
        if (e.response.data.STATUS === 500 || e.response.data.STATUS === 520) {
          this.isErrorMessage = true;
          this.errorMessage = e.response.data.INFO;
          this.sendLog({
            formName: "PasswordRecoveryForm errorMessage",
            idEventType: this.loginFieldType === "phone" ? 153 : 164,
            message: `Показало сообщение об ошибке на ${
              this.loginFieldType === "phone" ? "номере" : "электронной почте"
            }"`,
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
        this.sendLog({
          formName: "PasswordRecoveryForm errorMessage",
          idEventType: this.loginFieldType ? 153 : 164,
          message: `Показало сообщение об ошибке на ${
            this.loginFieldType === "phone" ? "номере" : "электронной почте"
          }"`,
        });
      } else {
        this.isErrorMessage = false;
        this.errorMessage = null;
      }
    },
    async checkIfButtonClicked(data) {
      this.changePhoneButtonClicked = data;
      if (this.visibleForm === "phone") {
        this.isPhoneCodeValid = false;
      }
      if (this.visibleForm === "email") {
        this.isEmailCodeValid = false;
      }
      this.isCodeFieldValid = false;
    },
  },

  validations() {
    return {
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
          sameAsPassword: helpers.withMessage("Пароли не совпадают", (value, siblings) => value === siblings.password),
        },
        birthdate: {
          required,
        },
      },
    };
  },
};
</script>

<style scoped></style>
