<template>
  <div>
    <div class="change-number">
      <div class="row">
        <b-form-group :label="data.label" :class="{ required: data.required }">
          <b-form-input
            ref="userInput"
            v-model="newPhone"
            :placeholder="placeholder"
            v-mask="changeMask"
            :state="validateState('newPhone')"
            @blur="update"
            autocomplete="off"
            autofocus
            :disabled="isShowCodeEnter"
          ></b-form-input>
          <b-form-invalid-feedback
            >Пожалуйста, заполните это поле</b-form-invalid-feedback
          >
        </b-form-group>

        <div class="col-12 col-md-6 mt-2 mt-md-0">
          <!-- <b-button
            type="submit"
            v-if="!isShowCodeEnter"
            @click="verifyUser"
            variant="success"
            class="btn-sms"
            :disabled="$v.newPhone.$invalid"
            >Подтвердить</b-button
          > -->
        </div>
      </div>
      <b-button
        type="submit"
        v-if="!isShowCodeEnter || !disabledResend"
        @click="verifyUser"
        variant="success"
        class="btn-sms mt-3"
        :disabled="$v.newPhone.$invalid"
        >Получить sms-код</b-button
      >
      <div v-if="isShowCodeEnter" class="resend">
        <b-link @click="changeNumber" class="col-12 col-md-12">
          Изменить номер
        </b-link>
      </div>
      <recaptcha @error="onError" @success="onSuccess" @expired="onExpired" />
    </div>
    <div class="resend-block" v-if="isShowCodeEnter">
      <p>
        <template v-if="disabledResend"
          >На указанный номер мы направили sms-код, просим ввести его в поле
          ниже.<br />
          Повторный код можно запросить через
          <verify-timer @onFinish="stopTimer" :duration="duration" />
          сек.</template
        >
      </p>
      <!-- <b-button
        type="submit"
        :disabled="disabledResend"
        @click="resendCode"
        variant="success"
      >
        Отправить повторно
      </b-button> -->
    </div>
  </div>
</template>

<script>
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import _ from "lodash";
export default {
  components: { VerifyTimer },
  mixins: [validationMixin],
  name: "ControlPhoneChange",
  data() {
    return {
      isSendCode: false,
      disabledResend: true,
      duration: 20,
      newPhone: "",
      mask: "",
      placeholder: "+7(___)-___-__-__",
      isPhoneChanged: false,
      token: 1,
      isUserBlured: true,
      isUserDisabled: false,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    params: {
      type: Object,
      required: false,
    },
  },
  validations: {
    newPhone: {
      required,
      minLength: minLength(17),
    },
  },
  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.debouncedGetCode = _.debounce(this.getCode, 100);
  },
  methods: {
    update() {
      this.$v.newPhone.$touch();
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.newPhone,
      });
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },
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
        await this.$recaptcha.getResponse();
      } catch (error) {
        console.log("Login error:", error);
      }
    },

    // async getCode() {
    //   if (!this.newPhone) return;
    //   this.isPhoneChanged = false;
    //   try {
    //     this.disabledResend = true;
    //     let params = {
    //       PHONE: this.newPhone,
    //       loginType: "phone",
    //       modeType: "RECOVERY",
    //     };
    //     const response = await this.$store.dispatch("getCode", params);
    //     if (response?.status === 500) {
    //       return;
    //     }

    //     if (response?.data[0]?.ERRORCODE === 106) {
    //       await this.$recaptcha.getResponse();
    //       await this.$recaptcha.reset();
    //       params = {
    //         ...params,
    //         token: this.token,
    //         modeType: "RECOVERY",
    //         error: true,
    //       };
    //       const response = await this.$store.dispatch("getCode", params);

    //       if (response?.data[0]?.ERRORLIST) {
    //         this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT);
    //       } else {
    //         this.isSendCode = true;
    //       }
    //     } else {
    //       this.isSendCode = true;
    //     }
    //   } catch (e) {
    //     console.log(e);
    //   }
    // },

    async getCode() {
      if (!this.newPhone) return;
      this.isPhoneChanged = false;
      let actionParams = {
        name: "SNEWPHONE",
        value: this.newPhone,
      };
      try {
        this.disabledResend = true;
        let response = await this.$store.dispatch("data_card/executeAction", {
          actionId: this.params.actions[0].id,
          relActionId: this.params.actions[0].relaction,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
          body: [actionParams],
        });
        if (response?.status === 500) {
          this.$store.commit("data_card/setError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
          this.$store.commit("data_card/setFormField", {
            fieldId: 26713,
            value: "",
          });
        }
        if (response?.status === 200) {
          this.$store.commit("data_card/setError", false);
          this.$store.commit("data_card/setErrorMessage", null);
          this.isSendCode = true;
          this.$bvToast.toast("Успешно выполнено", {
            title: "",
            variant: "success",
            solid: true,
          });
        }
      } catch (e) {
        console.log(e);
      }
    },

    verifyUser(e) {
      this.$store.commit("clearAxiosError");
      this.getCode();
    },

    changeNumber() {
      this.isUserBlured = false;
      this.$v.newPhone.$model = "";
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.isSendCode = false;
    },

    blurField(field) {
      this.isUserBlured = true;
      this.v[field].$touch();
    },

    // async resendCode() {
    //   let params = {
    //     PHONE: this.newPhone,
    //     loginType: "phone",
    //   };
    //   params = { ...params, token: this.token, modeType: "RECOVERY" };
    //   const response = await this.$store.dispatch("getCode", params);
    //   if (response?.data[0]?.ERRORCODE === 106) {
    //     const token = await this.$recaptcha.getResponse();
    //     await this.$recaptcha.reset();
    //     params = {
    //       ...params,
    //       token: this.token,
    //       error: true,
    //     };
    //     const response = await this.$store.dispatch("getCode", params);
    //     if (response?.data[0]?.ERRORLIST) {
    //       this.$emit("error", response?.data[0]?.ERRORLIST[0].ERRORTEXT);
    //     } else {
    //       this.isSendCode = true;
    //     }
    //   }

    //   if (
    //     response?.status === 500 ||
    //     Boolean(response?.data[0]?.ERRORCODE) === true
    //   ) {
    //     return;
    //   }
    //   this.disabledResend = true;
    // },
    stopTimer() {
      this.isSendCode = false;
      this.disabledResend = false;
    },
  },

  computed: {
    changeMask() {
      return (this.mask = "+7(###)-###-##-##");
    },
    isShowCodeEnter() {
      return !this.$v.newPhone.$invalid && this.isSendCode;
    },
    // newPhone: {
    //   get: function () {
    //     return this.data.value;
    //   },
    //   set: function (value) {
    //     this.$emit("update", {
    //       fieldId: this.data.fieldId,
    //       name: this.data.name,
    //       value: value,
    //     });
    //   },
    // },
  },
  destroyed() {
    this.isSendCode = false;
  },
  watch: {
    // "$v.newPhone.$model": function () {
    //   if (this.$v.newPhone.$invalid === false) {
    //     this.debouncedGetCode();
    //   }
    // },
  },
};
</script>

<style scoped lang="scss">
.change-number {
  display: flex;
  align-items: center;
  & .row {
    margin-left: 0px;
  }
}
.resend {
  margin-top: 20px;
}
.resend-block {
  //   margin-left: -15px;
  margin-bottom: 15px;
}

.help-text {
  font-size: 12px;
  margin-top: 10px;
}
.danger-text {
  color: red;
  font-size: 12px;
  margin-top: 10px;
}
.required > legend:after {
  content: "*";
  color: red;
}
</style>
