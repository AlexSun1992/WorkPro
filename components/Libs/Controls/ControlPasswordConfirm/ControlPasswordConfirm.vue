<template>
  <div class="row">
    <div class="col-12 col-lg-6">
      <form-group class="position-relative">
        <validation-window
          v-if="isShowValidationWindow"
          :passwordValue="$v.form.password1.$model"
          :v="$v"
        />
        <legend>
          Новый пароль
          <span class="position-relative"
            >&nbsp;
            <span class="tooltipster">
              (?)<vue-easy-tooltip
                :with-arrow="true"
                position="top"
                :offset="4"
              >
                <span>{{ tooltipValidation }}</span></vue-easy-tooltip
              ></span
            ></span
          >
        </legend>
        <b-form-input
          id="password1"
          :type="pswVisible ? 'text' : 'password'"
          placeholder="Пароль"
          v-model="$v.form.password1.$model"
          @focus="showValidationWindow"
          @blur="hiddenValidationWindow"
          :state="validateState('password1')"
          class="form-control"
          data-testid="password1"
          @input="updateValue($event)"
        >
        </b-form-input>
        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW()"
          tabindex="-1"
        ></button>
        <div
          class="invalid-feedback"
          v-if="!isShowValidationWindow"
        >
          Пароль не отвечает условиям
        </div>
      </form-group>
    </div>
    <div class="col-12 col-lg-6 mt-3 mt-lg-0">
      <form-group class="position-relative">
        <legend>Повторите пароль</legend>
        <b-form-input
          id="password2"
          :type="pswVisible2 ? 'text' : 'password'"
          placeholder="Повторите пароль"
          v-model="$v.form.password2.$model"
          @blur="$v.form.password2.$touch()"
          :state="validateState('password2')"
          class="form-control"
          data-testid="password2"
          @input="updateValue($event)"
          @focus="checkSamePassword"
        ></b-form-input>
        <button
          id="btn_password_visible2"
          type="button"
          class="btn-psw-visible"
          tabindex="-1"
          @click="visiblePSW2()"
        ></button>
        <div
          class="invalid-feedback"
          v-if="validateState('password2') === false"
        >
          Пароли не совпадают
        </div>
      </form-group>
    </div>
  </div>
</template>

<script>
import { BFormInput } from "bootstrap-vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minLength, maxLength, helpers } from "@vuelidate/validators";
import { minLengthPassword, maxLengthPassword } from "./regform.helper.fixtures";
// eslint-disable-next-line import/extensions
import { passwordValidationDetail, tooltipText } from "@/components/Login/RegForm/regform.helper";
import ValidationWindow from "@/components/Login/Libs/VerifyPassword/ValidationWindow";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "ControlPasswordConfirm",
  components: {
    FormGroup,
    BFormInput,
    ValidationWindow,
  },
  setup() {
    return { vuelidateRef: useVuelidate() };
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      pswVisible2: false,
      pswVisible: false,
      form: {
        password1: "",
        password2: "",
      },
      isShowValidationWindow: false,
    };
  },
  methods: {
    showValidationWindow() {
      this.isShowValidationWindow = true;
    },
    hiddenValidationWindow() {
      this.$v.form.password1.$touch();
      this.isShowValidationWindow = false;
    },
    checkSamePassword() {
      if (this.$v.form.password2.sameAsPassword === false && this.$v.form.password1.$model !== "") {
        this.$v.form.password2.$touch();
      }
    },
    updateValue(val) {
      if (passwordValidationDetail(val).length === 0) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val,
          errorMessageValidate: () => this.executeValidation.map((text) => text.errorText),
        });
      }
      if (passwordValidationDetail(val).length !== 0) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: "",
          errorMessageValidate: () => this.executeValidation.map((text) => text.errorText),
        });
      }
    },

    validateState(name) {
      const { $dirty, $error } = this.$v.form[name];
      return $dirty ? !$error : null;
    },
    visiblePSW() {
      this.pswVisible = this.pswVisible === false;
    },
    visiblePSW2() {
      this.pswVisible2 = this.pswVisible2 === false;
    },
  },

  computed: {
    executeValidation() {
      return passwordValidationDetail(this.$v.form.password1.$model);
    },
    disabled() {
      return !(
        this.$v.form.password1.$anyError === false &&
        this.$v.form.password1.$model !== "" &&
        this.$v.form.password2.$anyError === false &&
        this.$v.form.password2.$model !== ""
      );
    },
    tooltipValidation() {
      return tooltipText;
    },
  },

  validations() {
    return {
      form: {
        password1: {
          required,
          isPasswordValid: (value) => passwordValidationDetail(value).length === 0,
        },
        password2: {
          required,
          minLength: minLength(minLengthPassword),
          maxLength: maxLength(maxLengthPassword),
          sameAsPassword: helpers.withMessage("Пароли не совпадают", (value, siblings) => value === siblings.password1),
        },
      },
    };
  },
};
</script>

<style scoped></style>
