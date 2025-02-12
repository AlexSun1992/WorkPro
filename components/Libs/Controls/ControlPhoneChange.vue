<template>
  <div>
    <div class="change-number">
      <div class="row">
        <b-form-group
          :label="data.label"
          :class="[{ required: data.required }]"
          class="col-12 col-lg-4"
          :label-for="data.name"
        >
          <b-form-input
            ref="userInput"
            v-model="newPhone"
            v-mask="changeMask"
            :placeholder="placeholder"
            :state="validateState('newPhone')"
            autocomplete="off"
            autofocus
            :disabled="isShowCodeEnter"
            type="tel"
            @blur="update"
            :id="data.name"
          />
          <b-form-invalid-feedback>
            Пожалуйста, заполните это поле
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="col-auto">
          <button
            type="submit"
            class="btn btn-success mt-btn-form-3"
            :disabled="$v.newPhone.$invalid || loading || isSendCode"
            @click="verifyUser"
          >
            Получить smsCode-код
            <span
              v-if="loading"
              role="status"
              class="spinner-border text-danger"
              style="width: 1rem; height: 1rem"
            >
              <span class="sr-only">Spinning</span>
            </span>
          </button>
        </div>
        <div v-if="isShowCodeEnter" class="col-auto">
          <label class="d-none d-md-block">&nbsp;</label>
          <b-link class="link-button l-b-m-t d-block" @click="changeNumber">
            Изменить номер
          </b-link>
        </div>
      </div>
    </div>
    <div v-if="isShowCodeEnter" class="resend-block">
      <p>
        <template v-if="disabledResend">
          На указанный номер мы направили smsCode-код, просим ввести его в поле
          ниже.<br />
          Повторный код можно запросить через
          <verify-timer :duration="duration" @onFinish="stopTimer" />
          сек.
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength } from "vuelidate/lib/validators";
import _ from "lodash";
import { BFormGroup } from "bootstrap-vue";
import VerifyTimer from "../VerifyUser/VerifyTimer";

export default {
  name: "ControlPhoneChange",
  components: { VerifyTimer, BFormGroup },
  mixins: [validationMixin],
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
  validations: {
    newPhone: {
      required,
      minLength: minLength(17),
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

  unmounted() {
    this.isSendCode = false;
    localStorage.setItem("newPhone", this.newPhone);
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
    async getCode() {
      // Очищаем поле с кодом СМС
      this.$store.commit("data_card/clearFormField", {
        fieldId: 26713,
      });

      if (!this.newPhone) return;
      this.isPhoneChanged = false;
      const actionParams = {
        name: "SNEWPHONE",
        value: this.newPhone,
      };
      try {
        this.loading = true;
        this.disabledResend = true;
        const response = await this.$store.dispatch("data_card/executeAction", {
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
          this.$store.commit("data_card/clearFormField", {
            fieldId: 26713,
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
.btn-sms {
  height: 37px !important;
  line-height: 37px;
}
.l-b-m-t {
  margin-top: 10px;
}
</style>
