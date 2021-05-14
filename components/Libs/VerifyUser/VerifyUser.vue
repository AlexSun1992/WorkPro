<template>
  <div class="row">
    <p>{{ label }}</p>
    <b-form-group class="col-12 col-md-6">
      <b-form-input
        v-if="loginType === 'phone'"
        ref="userInput"
        v-model="v[loginType].$model"
        v-mask="changeMask"
        autofocus
        :placeholder="placeholder"
        :state="validateInput(loginType, isUserBlured)"
        :disabled="code"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
        @click="loginTouchesCount = 2"
      ></b-form-input>
      <b-form-input
        v-else-if="loginType === 'email'"
        ref="userInput"
        v-model="v[loginType].$model"
        autofocus
        :state="validateInput(loginType, isUserBlured)"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
        @click="loginTouchesCount = 2"
      ></b-form-input>
      <b-form-invalid-feedback
        >Пожалуйста, заполните это поле</b-form-invalid-feedback
      >
    </b-form-group>
    <div v-if="code" class="col-12 col-md-12">
      <div class="row">
        <b-link @click="changeNumber" class="col-12 col-md-12">{{
          loginType === "phone" ? "Изменить номер" : "Изменить email"
        }}</b-link>
        <p class="col-12 col-md-12">
          На указанный {{ loginType === "phone" ? "номер" : "email" }} выслан
          код подтверждения
        </p>
        <b-form-group class="col-12 col-md-6">
          <b-form-input
            autofocus
            v-model="v.code.$model"
            class="mb-2"
            v-mask="codeMask"
            :state="validateInput('code', isCodeBlured)"
            @blur="blurField('code', isCodeBlured)"
            @input="isCodeBlured = false"
            :disabled="disabled"
            placeholder="Код подтверждения"
          ></b-form-input>
          <b-form-invalid-feedback v-if="!v.code.$model"
            >Пожалуйста, заполните это поле</b-form-invalid-feedback
          >
          <b-form-invalid-feedback v-else
            >Неверный код подтверждения</b-form-invalid-feedback
          >
        </b-form-group>
        <div class="col-12 col-md-6 mt-2 mt-md-0">
          <b-button
            type="submit"
            :disabled="disabledResend"
            @click="resendCode"
            variant="success"
          >
            Отправить повторно
          </b-button>
        </div>
      </div>
    </div>
    <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />
    <div class="col-12 col-md-6 mt-2 mt-md-0">
      <b-button
        type="submit"
        v-if="!code"
        :disabled="loginType === 'phone' ? v.phone.$invalid : v.email.$invalid"
        @click.prevent="verifyUser"
        variant="success"
        class="btn-sms"
        >Подтвердить</b-button
      >
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";

export default {
  props: [
    "count",
    "v",
    "validateState",
    "disabled",
    "loginType",
    "label",
    "context",
  ],
  data() {
    return {
      isUserBlured: true,
      isCodeBlured: true,
      code: null,
      isUserDisabled: false,
      disabledResend: true,
      timer: null,
      initialCount: null,
      resendCount: null,
      isPhoneChanged: false,
      mask: "",
      codeMask: "######",
      placeholder: "+7(___)-___-__-__",
      loginTouchesCount: 0,
      token: null,
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
    onError(error) {
      console.log("Error:", error);
    },
    onSuccess(token) {
      this.token = token;
      console.log("Succeeded:", token);
    },
    onExpired() {
      console.log("Expired");
    },
    async getCaptcha() {
      try {
        const token = await this.$recaptcha.getResponse();
        await this.$recaptcha.reset();
      } catch (error) {
        console.log("Login error:", error);
      }
    },

    async getCode() {
      if (this.code) return;
      await this.getCaptcha();
      this.isPhoneChanged = false;
      try {
        if (!this.code && (this.v.phone.$model || this.v.email.$model)) {
          this.resendCount = this.initialCount;
          this.disabledResend = true;

          let params = this.getCodeParams(this.loginType);
          if (!this.token) return;
          params = { ...params, token: this.token };
          const response = await this.$store.dispatch("getCode", params);
          if (response) {
            this.code = "*";
          }
          // Для показа
          this.v.code.$model = this.code;
          this.$emit("onCode", this.code);
          this.isUserDisabled = true;
          this.countdown();
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    getCodeParams(loginType) {
      let params;
      if (this.loginType === "phone") {
        params = {
          PHONE: this.v.phone.$model,
          loginType: "phone",
        };
      } else {
        params = {
          EMAIL: this.v.email.$model,
          loginType: "email",
        };
      }
      return params;
    },

    async showForm() {
      if (!this.$v.user.$invalid) {
        this.isUserDisabled = true;
        this.countdown();
      }
    },

    verifyUser() {
      this.$store.commit("clearAxiosError");
      this.getCode();
    },

    changeNumber() {
      this.isUserBlured = false;
      this.v.phone.$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.code = null;
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("onCode", this.code);
    },

    validateInput(field, bluredField) {
      if (this.$store.getters.getRegistrationError) return;
      if (
        field === "phone" &&
        this.loginTouchesCount <= 2 &&
        bluredField &&
        !this.v[field].$model
      )
        return;
      if (this.v[field].$params.minLength) {
        if (this.$store.getters.getRegistrationError) {
          return false;
        }
        if (
          (this.v[field].$model &&
            this.v[field].$model.length ===
              this.v[field].$params.minLength.min) ||
          bluredField
        ) {
          return this.validateState(field);
        }
      }
    },

    blurField(field, bluredField) {
      if (field === "phone") {
        this.loginTouchesCount++;
        this.isUserBlured = true;
      } else if (field === "code") {
        this.isCodeBlured = true;
      }
      this.v[field].$touch();
    },

    countdown() {
      if (this.isPhoneChanged) {
        this.timer = null;
        return;
      }
      this.resendCount--;
      if (this.resendCount == 0) {
        this.disabledResend = false;
        clearTimeout(this.timer);
        this.resendCount = null;
      } else {
        if (this.isPhoneChanged) {
          this.timer = setTimeout(this.countdown, 1000);
          return this.resendCount;
        }
        this.timer = setTimeout(this.countdown, 1000);
        return this.resendCount;
      }
    },

    async resendCode() {
      this.v.code.$model = "";
      this.resendCount = this.initialCount;
      this.disabledResend = true;
      const params = this.getCodeParams(this.loginType);
      const response = await this.$store.dispatch("getCode", params);
      if (this.loginType === "phone") {
        this.code = response.data[0].TEMPPASS;
        this.v.code.$model = this.code;
      } else {
        // Для показа (заменить на код email)
        this.code = "*";
      }
      this.countdown();
    },
  },

  computed: {
    changeMask() {
      if (this.loginType === "phone") {
        this.placeholder = "+7(___)-___-__-__";
        return (this.mask = "+7(###)-###-##-##");
      } else {
        this.placeholder = "";
        return (this.mask = "X".repeat(50));
      }
    },
  },
};
</script>

<style>
.alert {
  position: relative;
  padding: 0.75rem 1.25rem;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 0.25rem;
}

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb;
}

.mx-datepicker {
  width: 100%;
}
.mx-datepicker .button-datapicker {
  position: absolute;
  top: 0;
  right: 0;
  height: 100%;
  background: url(/img/button-datapicker.svg) 50% 50% no-repeat;
  background-size: 16px;
  border: 0 !important;
  width: 28px;
}
.mx-datepicker .input-group > div {
  width: 100%;
}
.mx-datepicker .form-control.is-invalid,
.mx-datepicker .form-control.is-valid {
  background: #fff;
}
/*.form-group {*/
/*  margin: 0 !important;*/
/*}*/
</style>
<style scoped lang="scss">
@import "~/assets/scss/reg.scss";
</style>
