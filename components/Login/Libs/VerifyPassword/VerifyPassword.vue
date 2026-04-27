<template>
  <div class="row mt-3">
    <div class="col-12 col-lg-6">
      <b-form-group class="position-relative">
        <validation-window
          v-if="isShowValidationWindow"
          :passwordValue="this.v.password.$model"
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
        <b-form-input
          @focus="showValidationWindow"
          id="password1"
          v-model="passwordModel"
          :type="pswVisible ? 'text' : 'password'"
          :state="validateState('password')"
          placeholder="Пароль"
          @blur="hiddenValidationWindow"
          autocomplete="new-password"
          :disabled="disabled"
          @update="updateField('password')"
          data-testid="firstPass"
        ></b-form-input>
        <button
          id="btn_password_visible"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW()"
          tabindex="-1"
        ></button>
        <div
          class="invalid-feedback"
          v-if="!isShowValidationWindow && validateState('password') === false"
        >
          Пароль не отвечает условиям
        </div>
      </b-form-group>
    </div>
    <div
      class="col-12 col-lg-6"
      v-if="recovery"
    ></div>
    <div
      class="col-12 col-lg-6 password-repeat mt-3 mt-lg-0"
      :class="{ 'mt-0': recovery }"
    >
      <b-form-group
        :label="'Повторите пароль'"
        label-cols="12"
        class="required"
      >
        <b-form-input
          id="password2"
          :type="pswVisible2 ? 'text' : 'password'"
          autocomplete="off"
          v-model="passwordModel2"
          :state="validateState('password2')"
          placeholder="Повторите пароль"
          @blur="v.password2.$touch()"
          :disabled="disabled"
          @update="updateField('password2')"
          data-testid="secondPass"
        ></b-form-input>
        <button
          id="btn_password_visible2"
          type="button"
          class="btn-psw-visible"
          @click="visiblePSW2()"
          tabindex="-1"
        ></button>
        <div
          class="invalid-feedback"
          v-if="validateState('password2') === false"
        >
          Пароли не совпадают
        </div>
      </b-form-group>
    </div>
    <div
      class="col-12 col-lg-6"
      v-if="recovery"
    ></div>
  </div>
</template>

<script>
import VueEasyTooltip from "vue-easy-tooltip";
import { BFormInput, BFormGroup } from "bootstrap-vue";
import ValidationWindow from "./ValidationWindow";
// eslint-disable-next-line import/extensions
import { tooltipText } from "@/components/Login/RegForm/regform.helper";

export default {
  name: "VerifyPassword",
  props: ["v", "validateState", "disabled", "recovery", "tabIndex", "isValid", "logParams"],
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
      if (this.pswVisible === false) {
        this.pswVisible = true;
      } else {
        this.pswVisible = false;
      }
    },
    visiblePSW2() {
      if (this.pswVisible2 === false) {
        this.pswVisible2 = true;
      } else {
        this.pswVisible2 = false;
      }
    },
    updateField(field) {
      this.$emit("checkCodeFieldValid", this.validateState(field));
    },
    changeField(field) {
      if (this.validateState(field)) {
        this.$LogEvent({
          ...this.logParams,
          controlName: field,
          message: `Поле ${field} посещено`,
          timeUser: new Date(),
        });
      }
    },
  },
  components: {
    BFormInput,
    BFormGroup,
    VueEasyTooltip,
    ValidationWindow,
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
};
</script>

<style scoped></style>
