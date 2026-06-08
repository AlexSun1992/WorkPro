<template>
  <div class="row">
    <p>{{ label }}</p>
    <form-group class="col-12 col-md-6">
      <b-form-input
        v-if="loginType === 'phone'"
        ref="userInput"
        v-model="propModel"
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
        v-model="propModel"
        autofocus
        :state="validateInput(loginType, isUserBlured)"
        :disabled="isShowCodeEnter"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
        @click="loginTouchesCount = 2"
        @keyup.enter="verifyUser"
        :tabindex="tabIndex[0]"
        placeholder="Электронная почта"
        autocomplete="off"
      ></b-form-input>
      <div
        class="invalid-feedback"
        v-if="validateInput(loginType, isUserBlured) === false"
      >
        Пожалуйста, заполните это поле
      </div>
    </form-group>
    <div
      v-if="isShowCodeEnter"
      class="col-12 col-md-12"
    >
      <div class="row">
        <a
          href="#"
          @click="changeNumber"
          class="col-12 col-md-12"
          >{{ loginType === "phone" ? "Изменить номер" : "Изменить электронную почту" }}</a
        >
        <p class="col-12 col-md-12">
          {{ textMessage }}
          <template v-if="disabledResend"
            >Отправить повторно через
            <verify-timer
              @onFinish="stopTimer"
              :duration="duration"
            />
            сек.</template
          >
        </p>
        <form-group class="col-12 col-md-6">
          <b-form-input
            autofocus
            ref="codeInput"
            v-model="codeModel"
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
          <div
            class="invalid-feedback"
            v-if="v.code.$model === false"
          >
            Пожалуйста, заполните это поле
          </div>
          <div
            class="invalid-feedback"
            v-if="validateInput('code', isCodeBlured) === false"
          >
            Неверный код подтверждения
          </div>
        </form-group>
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
    <recaptcha
      @error="onError"
      @success="onSuccess"
      @expired="onExpired"
    />
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
import debounce from "lodash.debounce";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "VerifyUser",
  components: { VerifyTimer, FormGroup },
  props: {
    count: {
      type: Number,
      default: 0,
    },
    v: {
      type: Object,
      required: true,
    },
    validateState: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    loginType: {
      type: String,
      default: undefined,
    },
    modeType: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    context: {
      type: Object,
      default: () => ({}),
    },
    textMessage: {
      type: String,
      default: "",
    },
    tabIndex: {
      type: Array,
      default: () => [],
    },
  },
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

  computed: {
    codeModel: {
      get() {
        return this.v.code.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.code.$model = value;
      },
    },
    propModel: {
      get() {
        return this.v[this.loginType].$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v[this.loginType].$model = value;
      },
    },
    changeMask() {
      if (this.loginType === "phone") {
        this.placeholder = "+7(___)-___-__-__";
        this.mask = "+7(###)-###-##-##";
        return this.mask;
      }
      this.placeholder = "";
      this.mask = "X".repeat(50);
      return this.mask;
    },
    isShowCodeEnter() {
      if (this.loginType === "phone") {
        return !this.v.phone.$invalid && this.isSendCode;
      }
      return !this.v.email.$invalid && this.isSendCode;
    },
  },
  watch: {
    "v.phone.$model": function phone() {
      if (this.v.phone.$invalid === false && this.loginType === "phone") {
        this.debouncedGetCode();
      }
    },
    "v.email.$model": function email() {
      if (this.v.email.$invalid === false && this.loginType === "email") {
        this.debouncedGetCode();
      }
    },
  },
  created() {
    console.log("Создан");
    this.debouncedUpdate = debounce(this.blurField, 100);
    this.debouncedGetCode = debounce(this.getCode, 100);
  },
  unmounted() {
    this.isSendCode = false;
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
        if (this.loginType === "phone" ? !this.v.phone.$invalid : !this.v.email.$invalid) {
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
            if (this.modeType === "REG" && this.loginType === "phone" && (isInSystemLogin || isExpiredLogin)) {
              this.$bvModal
                .msgBoxConfirm("Введенный Вами мобильный телефон уже есть в системе!", {
                  title: "Подтверждение",
                  size: "md",
                  buttonSize: "md",
                  okVariant: "success",
                  okTitle: isInSystemLogin ? "Изменить номер телефона" : "Продолжить регистрацию",
                  cancelTitle: "Войти в систему",
                  footerClass: "p-2",
                  hideHeaderClose: false,
                  centered: true,
                  modalClass: this.myclass,
                  autoFocusButton: "ok",
                })
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
            if (response?.data[0]?.ERRORCODE === 106) {
              return;
            }
            this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT.replace(/^\[|\]$/g, ""));
          }
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    getCodeParams() {
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

    verifyUser() {
      this.$store.commit("clearAxiosError");
      this.getCode();
    },

    changeNumber() {
      this.isUserBlured = false;
      // eslint-disable-next-line vue/no-mutating-props
      this.v.phone.$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.code = null;
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.isSendCode = false;
      this.$emit("onCode", this.code);
    },

    validateInput(field, bluredField) {
      if (this.$store.getters.getRegistrationError) {
        return;
      }
      if (field === "phone" && this.loginTouchesCount <= 2 && bluredField && !this.v[field].$model) {
        return;
      }
      if (this.v[field].$params.minLength) {
        if (this.$store.getters.getRegistrationError) {
          return false;
        }
        if (
          (this.v[field].$model && this.v[field].$model.length === this.v[field].$params.minLength.min) ||
          bluredField
        ) {
          return this.validateState(field);
        }
      }
    },

    blurField(field) {
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

      if (response?.status === 500 || Boolean(response?.data[0]?.ERRORCODE) === true) {
        return;
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.v.code.$model = "";
      this.disabledResend = true;
      this.$refs.codeInput.focus();
    },
    stopTimer() {
      this.disabledResend = false;
    },
  },
};
</script>

<style scoped>
.btn-success {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid #28a745;
  border-radius: 0.25rem;
  color: #fff;
  background-color: #28a745;
  padding: 0 15px;
  font-size: 1.125rem;
  font-weight: 500;
}

.btn-success:disabled {
  opacity: 0.6;
  pointer-events: none;
}
.btn-sms {
  font-size: 1rem;
  font-weight: 400;
}

.btn-outline-secondary {
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  border: 1px solid #28a745;
  border-radius: 0.25rem;
  color: #28a745;
  background-color: #fff;
  padding: 0 15px;
  font-size: 1.125rem;
  font-weight: 500;
}
</style>
