<template>
  <div>
    <div class="change-number">
      <div class="row">
        <b-form-group
          :label="data.label"
          :class="[{ required: data.required }, data.labelCols]"
        >
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
        <div class="col-auto">
          <label class="d-none d-md-block">&nbsp;</label>
          <b-button
            type="submit"
            @click="verifyUser"
            variant="success"
            class="btn-sms"
            :disabled="$v.newPhone.$invalid || loading || isSendCode"
            >Получить sms-код
            <b-spinner
              v-if="loading"
              style="width: 1rem; height: 1rem"
              class="ml-2"
              variant="danger"
              label="Spinning"
            ></b-spinner>
          </b-button>
        </div>
        <div v-if="isShowCodeEnter" class="col-auto">
          <label class="d-none d-md-block">&nbsp;</label>
          <b-link @click="changeNumber" class="link-button mt-1">
            Изменить номер
          </b-link>
        </div>
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
      duration: 60,
      newPhone: "",
      mask: "",
      placeholder: "+7(___)-___-__-__",
      isPhoneChanged: false,
      token: 1,
      isUserBlured: true,
      isUserDisabled: false,
      loading: false,
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
    this.$store.commit("data_card/saveButtonClicked", false);
    if (process.client) {
      if (
        this.$store.getters["data_card/getErrorMessage"] &&
        localStorage.newPhone
      )
        this.newPhone = localStorage.newPhone;
    }
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.debouncedGetCode = _.debounce(this.getCode, 100);
  },
  methods: {
    update() {
      // this.$v.newPhone.$touch();
      if (this.newPhone != "") {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.newPhone,
        });
      }
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

    async getCode() {
      // Очищаем поле с кодом СМС
      this.$store.commit("data_card/setFormField", {
        fieldId: 26713,
        value: null,
      });

      if (!this.newPhone) return;
      this.isPhoneChanged = false;
      let actionParams = {
        name: "SNEWPHONE",
        value: this.newPhone,
      };
      try {
        this.loading = true;
        this.disabledResend = true;
        let response = await this.$store.dispatch("data_card/executeAction", {
          actionId: this.params.actions[0].id,
          relActionId: this.params.actions[0].relaction,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
          body: [actionParams],
        });
        if (response?.status === 500) {
          this.loading = false;
          this.$store.commit("data_card/setSavedError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
          this.$store.commit("data_card/setFormField", {
            fieldId: 26713,
            value: "",
          });
        }
        if (response?.status === 200) {
          this.loading = false;
          this.$store.commit("data_card/setSavedError", false);
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
    saveButtonClicked() {
      if (this.$store.getters["data_card/saveButtonClicked"]) {
        this.$v.newPhone.$touch();
      }
    },
  },
  watch: {
    saveButtonClicked() {
      console.log("clicked");
    },
  },

  destroyed() {
    this.isSendCode = false;
    localStorage.setItem("newPhone", this.newPhone);
  },
};
</script>

<style scoped lang="scss">
.resend {
  margin-top: 20px;
}
.resend-block {
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
.btn-sms {
  height: 37px !important;
  line-height: 37px;
}
</style>
