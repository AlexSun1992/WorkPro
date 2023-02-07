<template>
  <div class="login-form">
    <div class="container">
      <div class="row justify-content-center">
        <div
          v-if="formLoaded"
          class="block bg-six block-border-one mb-5 col-md-10 col-lg-6"
        >
          <h2 class="mb-3 text-center mt-5">Восстановление доступа</h2>
          <b-tabs
            @activate-tab="initData"
            ref="tabs"
            content-class="mt-4 block-registration"
          >
            <b-tab title="Телефон">
              <b-alert :show="isErrorMessage" variant="danger">{{
                errorMessage
              }}</b-alert>
              <div class="mb-3">
                Введите номер телефона указанный при регистрации
              </div>
              <verify-user
                ref="verifyUser"
                @error="showError"
                :loginType="'phone'"
                :mode-type="'RECOVERY'"
                :v="$v.form"
                :count="60"
                :validateState="validateState"
                :text-message="textMessage"
                :tab-index="[10, 15]"
              />
              <b-row class="mt-3">
                <b-form-group label="Дата рождения" class="col-md-6 col-12">
                  <birthday-picker
                    v-model="$v.form.birthdate.$model"
                    :state="validateState('birthdate')"
                    :tabindex="20"
                  />
                </b-form-group>
              </b-row>
              <b-row>
                <verify-password
                  :tab-index="[30, 40]"
                  :v="$v.form"
                  :validateState="validateState"
                />
              </b-row>
              <div class="mt-3 row justify-content-between">
                <router-link to="/login" class="col-6">
                  <b-button
                    tabindex="50"
                    variant="outline-secondary"
                    class="w-100"
                    >Отмена</b-button
                  >
                </router-link>
                <div class="col-6">
                  <b-button
                    tabindex="60"
                    variant="success"
                    @click="resetPassword"
                    :disabled="disabledReset"
                    class="w-100"
                    >Изменить пароль</b-button
                  >
                </div>
              </div>
            </b-tab>
            <b-tab title="Email">
              <div class="mb-3">Введите e-mail указанный при регистрации</div>
              <verify-user
                :loginType="'email'"
                :v="$v.form"
                :count="60"
                :validateState="validateState"
                :tab-index="[10, 15]"
              />
              <b-row class="mt-0">
                <verify-password
                  :tab-index="[20, 30]"
                  :v="$v.form"
                  :validateState="validateState"
                />
              </b-row>
              <div class="mt-3 row justify-content-between">
                <router-link to="/login" class="col-6">
                  <b-button variant="outline-secondary" class="w-100"
                    >Отмена</b-button
                  >
                </router-link>
                <div class="col-6">
                  <b-button
                    variant="success"
                    @click="resetPassword"
                    :disabled="disabledEmailReset"
                    class="w-100"
                    >Изменить пароль</b-button
                  >
                </div>
              </div>
            </b-tab>
          </b-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VerifyUser from "~/components/Libs/VerifyUser/VerifyUser";
import UserRecoveryForm from "~/components/Pages/Login/PasswordRecovery/UserRecoveryForm";
import { required, email, minLength, sameAs } from "vuelidate/lib/validators";
import birthdayPicker from "~/components/Libs/BirthdatePicker/BirthdatePicker";
import VerifyPassword from "../../../Libs/VerifyPassword/VerifyPassword";

export default {
  layout: "MainLayout",
  components: {
    VerifyUser,
    UserRecoveryForm,
    birthdayPicker,
    VerifyPassword,
  },
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
    };
  },
  mounted() {
    this.initData();
    this.formLoaded = true;
  },
  methods: {
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
          PASSWORD: this.$v.form.password.$model,
          PASSWORD_CONFIRM: this.$v.form.password2.$model,
        };
      }
      try {
        this.isErrorMessage = false;
        this.errorMessage = null;
        const response = await this.$store.dispatch("resetPassword", params);
        if (response?.data?.STATUS === 500) {
          this.isErrorMessage = true;
          this.errorMessage = response?.data?.INFO;
          return;
        }
        if (response.data[0]?.MESSAGE_CODE === "200") {
          this.$router.push("/login");
        } else if (response.data[0]?.MESSAGE_CODE === "502") {
          this.isErrorMessage = true;
          this.errorMessage = "Данные неверные";
        } else if (response.data[0]?.MESSAGE_CODE === "501") {
          this.isErrorMessage = true;
          this.errorMessage = "Необходимо ввести дополнительные данные";
        }
      } catch (e) {
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
    disabledReset() {
      return (
        this.$v.form.phone.$invalid ||
        this.$v.form.code.$invalid ||
        this.$v.form.birthdate.$invalid ||
        this.$v.form.password.$invalid ||
        this.$v.form.password2.$invalid
      );
    },
    disabledEmailReset() {
      return (
        this.$v.form.email.$invalid ||
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

<style scoped>
.login-form {
  background: url(/img/registration.svg) 50% top no-repeat;
  height: 100%;
  min-height: 900px;
  display: grid;
}
.block-registration p {
  padding: 0 15px;
}
</style>

<style scoped lang="scss">
@import "~/assets/scss/reg.scss";
</style>
