<template>
  <div class="row mt-3">
    <div class="col-12 col-lg-6">
      <form-group class="position-relative">
        <validation-window
          v-if="isShowValidationWindow"
          :password-value="this.v.password.$model"
          :v="v"
        />
        <legend>
          {{ showLabel }}
          <span class="position-relative"
            >&nbsp;<span class="tooltipster">
              (?)<vue-easy-tooltip
                v-if="isClient"
                :with-arrow="true"
                position="top"
                :offset="4"
              >
                <span>{{ tooltipValidation }}</span></vue-easy-tooltip
              ></span
            ></span
          >
        </legend>

        <form-input
          id="password1"
          v-model="passwordModel"
          :type="pswVisible ? 'text' : 'password'"
          :state="validateState('password')"
          :class="validClass(validateState('password'))"
          placeholder="Пароль"
          autocomplete="new-password"
          :disabled="disabled"
          data-testid="firstPass"
          @focus="showValidationWindow"
        ></form-input>

        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          tabindex="-1"
          @click="visiblePSW()"
        ></button>
        <div
          v-if="!isShowValidationWindow && validateState('password') === false"
          class="invalid-feedback"
        >
          Пароль не отвечает условиям
        </div>
      </form-group>
    </div>
    <div
      v-if="recovery"
      class="col-12 col-lg-6"
    ></div>
    <div
      class="col-12 col-lg-6 password-repeat mt-3 mt-lg-0"
      :class="{ 'mt-0': recovery }"
    >
      <form-group
        label="Повторите пароль"
        label-cols="12"
        class="required"
      >
        <input
          id="password2"
          v-model="passwordModel2"
          :type="pswVisible2 ? 'text' : 'password'"
          autocomplete="off"
          :class="validClass(validateState('password2'))"
          placeholder="Повторите пароль"
          :disabled="disabled"
          data-testid="secondPass"
        />

        <button
          id="btn_password_visible2"
          type="button"
          class="btn-psw-visible"
          tabindex="-1"
          @click="visiblePSW2()"
        ></button>
        <div
          v-if="validateState('password2') === false"
          class="invalid-feedback"
        >
          Пароли не совпадают
        </div>
      </form-group>
    </div>
    <div
      v-if="recovery"
      class="col-12 col-lg-6"
    ></div>
  </div>
</template>

<script>
import VueEasyTooltip from "vue-easy-tooltip";
import ValidationWindow from "./ValidationWindow";
// eslint-disable-next-line import/extensions
import { tooltipText } from "@/components/Login/RegForm/regform.helper";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import FormInput from "@/components/Libs/FormInput/FormInput";

export default {
  name: "VerifyPassword",
  components: {
    FormInput,
    FormGroup,
    VueEasyTooltip,
    ValidationWindow,
  },
  props: {
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
    recovery: {
      type: Boolean,
      default: false,
    },
    tabIndex: {
      type: Array,
      default: () => [],
    },
    isValid: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isClient: false,
      password: "",
      password2: "",
      pswVisible2: false,
      pswVisible: false,
      isUserBlured: true,
      isShowValidationWindow: false,
    };
  },
  computed: {
    passwordModel: {
      get() {
        return this.v.password.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.password.$model = value;
      },
    },
    passwordModel2: {
      get() {
        return this.v.password2.$model;
      },
      set(value) {
        // eslint-disable-next-line vue/no-mutating-props
        this.v.password2.$model = value;
      },
    },
    showLabel() {
      return this.recovery ? "Придумайте новый пароль" : "Пароль";
    },
    tooltipValidation() {
      return tooltipText;
    },
  },
  mounted() {
    this.isClient = true;
  },
  methods: {
    showValidationWindow() {
      this.isShowValidationWindow = true;
    },
    hiddenValidationWindow() {
      this.v.password.$touch();
      this.isShowValidationWindow = false;
    },
    visiblePSW() {
      this.pswVisible = !this.pswVisible;
    },
    visiblePSW2() {
      this.pswVisible2 = !this.pswVisible2;
    },
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      if (this.validateState(field)) {
        this.$LogEvent({
          formName: "Registration",
          controlName: field,
          message: `Поле ${field} посещено`,
          timeUser: new Date(),
        });
      }
    },
    validClass(state) {
      if (state) {
        return "is-valid";
      }
      if (state === null) {
        return "";
      }
      return "is-invalid";
    },
  },
};
</script>

<style scoped></style>
