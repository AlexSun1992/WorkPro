<template>
  <div>
    <div class="change-email">
      <div class="row">
        <b-form-group
          :label="data.label"
          :class="[{ required: data.required }]"
          class="col-12 col-lg-4"
          :label-for="data.name"
        >
          <b-form-input
            ref="userInput"
            v-model="newEmail"
            :placeholder="placeholder"
            :state="validateState('newEmail')"
            @blur="update"
            @input="changeField('newEmail')"
            autocomplete="off"
            df
            :disabled="isShowCodeEnter"
            type="email"
            data-testid="getCodeInput"
            :id="data.name"
          ></b-form-input>

          <div
            class="invalid-feedback"
            v-if="!$v.newEmail.$model"
          >
            Пожалуйста, заполните это поле
          </div>
          <div
            class="invalid-feedback"
            v-if="$v.newEmail.email.$invalid && !$v.newEmail.forbiddenRussianSign.$invalid"
          >
            Пожалуйста, введите корректную электронную почту
          </div>
          >

          <div
            class="invalid-feedback"
            v-if="$v.newEmail.$model && $v.newEmail.forbiddenPlusSign.$invalid"
          >
            Пожалуйста, введите корректную электронную почту
          </div>

          <div
            class="invalid-feedback"
            v-if="$v.newEmail.$model && $v.newEmail.forbiddenRussianSign.$invalid"
          >
            Русские символы запрещены
          </div>
        </b-form-group>
        <div class="col-auto">
          <button
            type="submit"
            @click="verifyUser"
            class="btn btn-success mt-btn-form-3"
            :disabled="$v.newEmail.$invalid || loading || isSendCode"
            data-testid="getCodeButton"
            :id="data.fieldId"
          >
            Получить код

            <span
              v-if="loading"
              class="spinner-border ml-2"
            >
              <span class="sr-only"></span>
            </span>
          </button>
        </div>
        <div
          v-if="isShowCodeEnter"
          class="col-auto"
        >
          <label class="d-none d-md-block">&nbsp;</label>
          <a
            href="#"
            @click="changeEmail"
            class="link-button d-block l-b-m-t"
          >
            Изменить электронную почту
          </a>
        </div>
      </div>
    </div>
    <div
      class="resend-block"
      v-if="isShowCodeEnter"
    >
      <p>
        <template v-if="disabledResend">
          Проверочный код выслан на указанную электронную почту.<br />Повторно код можно запросить через
          <verify-timer
            @onFinish="stopTimer"
            :duration="duration"
          />
          сек.
        </template>
      </p>
    </div>
  </div>
</template>

<script>
import { useVuelidate } from "@vuelidate/core";
import { required, email, helpers } from "@vuelidate/validators";
import { BFormGroup, BFormInput } from "bootstrap-vue";
import debounce from "lodash.debounce";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";

const forbiddenRussianSign = helpers.regex(/^[^а-яА-ЯёЁ]*$/i);

const forbiddenPlusSign = helpers.regex(/^[^+]*$/i);

export default {
  components: {
    VerifyTimer,
    BFormGroup,
    BFormInput,
  },
  setup() {
    return { vuelidateRef: useVuelidate() };
  },
  name: "ControlEmailChange",
  data() {
    return {
      isSendCode: false,
      disabledResend: true,
      duration: 60,
      newEmail: "",
      placeholder: "Электронная почта",
      isEmailChanged: false,
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
      required: true,
    },
  },
  validations: {
    newEmail: {
      required,
      email,
      forbiddenRussianSign,
      forbiddenPlusSign,
    },
  },
  created() {
    this.$store.commit("data_card/saveButtonClicked", false);
    this.debouncedUpdate = debounce(this.blurField, 100);
    this.debouncedGetCode = debounce(this.getCode, 100);
  },
  mounted() {
    this.newEmail = this.data.value;
  },
  methods: {
    update() {
      this.$v.newEmail.$touch();
    },
    validateState(name) {
      const { $dirty, $error } = this.$v[name];
      return $dirty ? !$error : null;
    },

    changeField(name) {
      this.$v.newEmail.$touch();
      this.validateState(name);
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
      if (this.getSMSCodeComponent) {
        this.$store.commit(`${this.ns}/clearFormField`, {
          fieldId: this.getSMSCodeComponent?.fieldId,
        });
      }

      if (!this.newEmail) return;
      this.isEmailChanged = false;
      const actionParams = {
        name: "SNEWEMAIL",
        value: this.newEmail,
      };
      try {
        this.loading = true;
        this.disabledResend = true;
        const response = await this.$store.dispatch(`${this.ns}/executeAction`, {
          actionId: this.params.actions[0].id,
          relActionId: this.params.actions[0].relaction,
          relId: this.params.idRel ?? this.$route.params.idRel,
          rowId: this.params.idCard ?? this.$route.params.idCard,
          body: [actionParams],
        });
        if (response?.status === 500 || response?.status === 520) {
          this.loading = false;
          this.$store.commit(`${this.ns}/setSavedError`, true);
          this.$store.commit(`${this.ns}/setErrorMessage`, response.data);
          this.$store.commit(`${this.ns}/setFormField`, response.data);
          this.$store.commit(`${this.ns}/setFormField`, {
            fieldId: 35622,
            value: null,
          });
        }
        if (response?.status === 200) {
          this.loading = false;
          this.$store.commit(`${this.ns}/setSavedError`, false);
          this.$store.commit(`${this.ns}/setErrorMessage`, null);
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

    verifyUser() {
      this.getCode();
      if (this.newEmail != "") {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.newEmail,
        });
      }
    },

    changeEmail() {
      this.isUserBlured = false;
      this.$refs.userInput.$el.disabled = false;
      this.$refs.userInput.$el.focus();
      this.isUserDisabled = false;
      this.isEmailChanged = true;
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
    getSMSCodeComponent() {
      return this.$store.getters[`${this.ns}/getCopyForm`].find((el) => el.name === "SCODEFIELD");
    },
    isShowCodeEnter() {
      return !this.$v.newEmail.$invalid && this.isSendCode;
    },
    saveButtonClicked() {
      if (this.$store.getters[`${this.ns}/saveButtonClicked`]) {
        this.$v.newEmail.$touch();
      }
      return {};
    },
    ns() {
      return this.params.ns;
    },
  },
  watch: {
    saveButtonClicked() {
      console.log("clicked");
    },
  },
  unmounted() {
    this.isSendCode = false;
  },
};
</script>

<style scoped>
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
