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
        :disabled="isShowCodeEnter"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
        @click="loginTouchesCount = 2"
        tabindex="10"
        autocomplete="off"
      ></b-form-input>
      <b-form-input
        v-else-if="loginType === 'email'"
        ref="userInput"
        v-model="v[loginType].$model"
        autofocus
        :state="validateInput(loginType, isUserBlured)"
        :disabled="isShowCodeEnter"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
        @click="loginTouchesCount = 2"
        @keyup.enter="verifyUser"
        :tabindex="tabIndex[0]"
        placeholder="E-mail"
        autocomplete="off"
      ></b-form-input>
      <b-form-invalid-feedback
        >Пожалуйста, заполните это поле</b-form-invalid-feedback
      >
    </b-form-group>
    <div v-if="isShowCodeEnter" class="col-12 col-md-12">
      <div class="row">
        <b-link @click="changeNumber" class="col-12 col-md-12">{{
          loginType === "phone" ? "Изменить номер" : "Изменить email"
        }}</b-link>
        <p class="col-12 col-md-12">
          {{ textMessage }}
          <template v-if="disabledResend"
            >Отправить повторно можно через
            <verify-timer @onFinish="stopTimer" :duration="duration" />
            сек.</template
          >
        </p>
        <b-form-group class="col-12 col-md-6">
          <b-form-input
            autofocus
            ref="codeInput"
            v-model="v.code.$model"
            class="mb-2"
            v-mask="codeMask"
            :state="validateInput('code', isCodeBlured)"
            @blur="blurField('code', isCodeBlured)"
            @input="isCodeBlured = false"
            :disabled="disabled"
            autocomplete="off"
            :tabindex="tabIndex[1]"
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
          <button
            type="submit"
            :disabled="disabledResend"
            @click="resendCode"
            class="btn btn-success"
          >
            Отправить повторно
          </button>
        </div>
      </div>
    </div>
    <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />
    <div class="col-12 col-md-6 mt-2 mt-md-0">
      <button
        type="submit"
        v-if="!isShowCodeEnter"
        :disabled="loginType === 'phone' ? v.phone.$invalid : v.email.$invalid"
        @click="verifyUser"
        class="btn btn-success btn-sms"
      >
        Подтвердить
      </button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";

export default {
  components: { VerifyTimer },
  props: [
    "count",
    "v",
    "validateState",
    "disabled",
    "loginType",
    "modeType",
    "label",
    "context",
    "textMessage",
    "tabIndex",
  ],
  data() {
    return {
      isSendCode: false,
      isUserBlured: true,
      isCodeBlured: true,
      code: 1,
      isUserDisabled: false,
      disabledResend: true,
      timer: null,
      isPhoneChanged: false,
      mask: "",
      codeMask: "#####",
      placeholder: "+7(___)-___-__-__",
      loginTouchesCount: 0,
      token: 1,
      myclass: ["cabinet"],
      duration: 60,
    };
  },
  created() {
    console.log("Создан");
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.debouncedGetCode = _.debounce(this.getCode, 100);
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
      } catch (error) {
        console.log("Login error:", error);
      }
    },

    async getCode() {
      this.isPhoneChanged = false;
      this.$emit("error", null);
      try {
        if (
          this.loginType === "phone"
            ? !this.v.phone.$invalid
            : !this.v.email.$invalid
        ) {
          this.disabledResend = true;

          let params = this.getCodeParams(this.loginType);
          params = { ...params, token: this.token, modeType: this.modeType };
          const response = await this.$store.dispatch("getCode", params);
          if (response?.status === 500) {
            return;
          }

          if (response?.data[0]?.ERRORCODE === 106) {
            const token = await this.$recaptcha.getResponse();
            await this.$recaptcha.reset();
            params = {
              ...params,
              token: this.token,
              modeType: this.modeType,
              error: true,
            };
            const response = await this.$store.dispatch("getCode", params);

            if (response?.data[0]?.ERRORLIST) {
              this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT);
            } else {
              this.isSendCode = true;
            }
          }
          const isError = Boolean(response?.data[0]?.ERRORCODE);
          const isErrorList = Boolean(response?.data[0]?.ERRORLIST);
          const isInSystemLogin = response?.data[0]?.MESSAGE_CODE === 201;
          const isExpiredLogin = response?.data[0]?.MESSAGE_CODE === 202;
          if (isError === false) {
            if (
              this.modeType === "REG" &&
              this.loginType === "phone" &&
              (isInSystemLogin || isExpiredLogin)
            ) {
              this.$bvModal
                .msgBoxConfirm(
                  "Введенный Вами мобильный телефон уже есть в системе!",
                  {
                    title: "Подтверждение",
                    size: "md",
                    buttonSize: "md",
                    okVariant: "success",
                    okTitle: isInSystemLogin
                      ? "Изменить номер телефона"
                      : "Продолжить регистрацию",
                    cancelTitle: "Войти в систему",
                    footerClass: "p-2",
                    hideHeaderClose: false,
                    centered: true,
                    modalClass: this.myclass,
                    autoFocusButton: "ok",
                  }
                )
                .then((value) => {
                  if (value === true) {
                    if (isInSystemLogin) {
                      this.changeNumber();
                    }
                    if (isExpiredLogin) {
                      this.isSendCode = true;
                    }
                  }
                  if (value === false) {
                    this.$router.push("/login");
                  }
                })
                .catch((err) => {
                  console.log(err);
                });
            } else {
              this.isSendCode = true;
            }
          } else if (isErrorList === true) {
            if (response?.data[0]?.ERRORCODE === 106) return;
            this.$emit(
              "error",
              response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, "")
            );
          }
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
      }
    },

    verifyUser(e) {
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
      this.isSendCode = false;
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

    async resendCode() {
      let params = this.getCodeParams(this.loginType);
      params = { ...params, token: this.token, modeType: this.modeType };
      const response = await this.$store.dispatch("getCode", params);
      if (response?.data[0]?.ERRORCODE === 106) {
        const token = await this.$recaptcha.getResponse();
        await this.$recaptcha.reset();
        params = {
          ...params,
          token: this.token,
          modeType: this.modeType,
          error: true,
        };
        const response = await this.$store.dispatch("getCode", params);
        if (response?.data[0]?.ERRORLIST) {
          this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT);
        } else {
          this.isSendCode = true;
        }
      }

      if (
        response?.status === 500 ||
        Boolean(response?.data[0]?.ERRORCODE) === true
      ) {
        return;
      }
      this.v.code.$model = "";
      this.disabledResend = true;
      this.$refs.codeInput.focus();
    },
    stopTimer() {
      this.disabledResend = false;
    },
  },

  computed: {
    changeMask() {
      if (this.loginType === "phone") {
        this.placeholder = "+7(___)-___-__-__";
        return (this.mask = "+7(###)-###-##-##");
      }
      this.placeholder = "";
      return (this.mask = "X".repeat(50));
    },
    isShowCodeEnter() {
      if (this.loginType === "phone") {
        return !this.v.phone.$invalid && this.isSendCode;
      }
      return !this.v.email.$invalid && this.isSendCode;
    },
  },
  watch: {
    "v.phone.$model": function () {
      if (this.v.phone.$invalid === false && this.loginType === "phone") {
        this.debouncedGetCode();
      }
    },
    "v.email.$model": function () {
      if (this.v.email.$invalid === false && this.loginType === "email") {
        this.debouncedGetCode();
      }
    },
  },
  destroyed() {
    this.isSendCode = false;
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
