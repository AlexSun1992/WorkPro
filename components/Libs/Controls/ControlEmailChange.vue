<template>
  <div>
    <div class="change-email">
      <div class="row">
        <b-form-group
          :label="data.label"
          :class="[{ required: data.required }]"
          class="col-12 col-lg-4"
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
            autofocus
            :disabled="isShowCodeEnter"
            type="email"
            data-testid="getCodeInput"
          ></b-form-input>

          <b-form-invalid-feedback v-if="!$v.newEmail.$model"
            >Пожалуйста, заполните это поле</b-form-invalid-feedback
          >
          <b-form-invalid-feedback
            v-if="
              $v.newEmail.email === false &&
              $v.newEmail.forbiddenRussianSign === true
            "
            >Пожалуйста, введите корректный e-mail</b-form-invalid-feedback
          >

          <b-form-invalid-feedback
            v-if="$v.newEmail.$model && $v.newEmail.forbiddenPlusSign === false"
          >
            Пожалуйста, введите корректный e-mail
          </b-form-invalid-feedback>

          <b-form-invalid-feedback
            v-if="
              $v.newEmail.$model && $v.newEmail.forbiddenRussianSign === false
            "
          >
            Русские символы запрещены
          </b-form-invalid-feedback>
        </b-form-group>
        <div class="col-auto">
          <button
            type="submit"
            @click="verifyUser"
            class="btn btn-success mt-btn-form-3"
            :disabled="$v.newEmail.$invalid || loading || isSendCode"
            data-testid="getCodeButton"
          >
            Получить код

            <span
              v-if="loading"
              style="width: 1rem; height: 1rem"
              role="status"
              class="spinner-border text-danger ml-2"
            >
              <span class="sr-only">Spinning</span>
            </span>
          </button>
        </div>
        <div v-if="isShowCodeEnter" class="col-auto">
          <label class="d-none d-md-block">&nbsp;</label>
          <b-link @click="changeEmail" class="link-button d-block l-b-m-t">
            Изменить e-mail
          </b-link>
        </div>
      </div>
    </div>
    <div class="resend-block" v-if="isShowCodeEnter">
      <p>
        <template v-if="disabledResend">
          Проверочный код выслан на указанный e-mail.<br />Повторно код можно
          запросить через
          <verify-timer @onFinish="stopTimer" :duration="duration" /> сек.
        </template>
      </p>
    </div>
  </div>
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, email, helpers } from "vuelidate/lib/validators";
import { BFormGroup, BFormInput, BFormInvalidFeedback } from "bootstrap-vue";
import _ from "lodash";
import VerifyTimer from "../VerifyUser/VerifyTimer";

const forbiddenRussianSign = helpers.regex(
  "forbiddenRussian",
  /^[^а-яА-ЯёЁ]*$/i
);

const forbiddenPlusSign = helpers.regex("forbiddenPlusSign", /^[^+]*$/i);

export default {
  components: {
    VerifyTimer,
    BFormGroup,
    BFormInput,
    BFormInvalidFeedback,
  },
  mixins: [validationMixin],
  name: "ControlEmailChange",
  data() {
    return {
      isSendCode: false,
      disabledResend: true,
      duration: 60,
      newEmail: "",
      placeholder: "Email",
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
      required: false,
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
    this.debouncedUpdate = _.debounce(this.blurField, 100);
    this.debouncedGetCode = _.debounce(this.getCode, 100);
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
      this.$store.commit("data_card/clearFormField", {
        fieldId: 35622,
      });

      if (!this.newEmail) return;
      this.isEmailChanged = false;
      const actionParams = {
        name: "SNEWEMAIL",
        value: this.newEmail,
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
        if (response?.status === 500 || response?.status === 520) {
          this.loading = false;
          this.$store.commit("data_card/setSavedError", true);
          this.$store.commit("data_card/setErrorMessage", response.data);
          this.$store.commit("data_card/setFormField", {
            fieldId: 35622,
            value: null,
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
    isShowCodeEnter() {
      return !this.$v.newEmail.$invalid && this.isSendCode;
    },
    saveButtonClicked() {
      if (this.$store.getters["data_card/saveButtonClicked"]) {
        this.$v.newEmail.$touch();
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
