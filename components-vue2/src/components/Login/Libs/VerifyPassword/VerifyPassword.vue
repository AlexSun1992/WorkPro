<template>
  <div class="row mt-3">
    <div class="col-12 col-lg-6">
      <validation-window
        v-if="!toggleVerifyWindow"
        :passwordValue="this.v.password.$model"
      />
      <b-form-group>
        <legend>
          {{ showLabel }}
          <span class="tooltipster">
            (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
              <span>{{ tooltipValidation }}</span></vue-easy-tooltip
            ></span
          >
        </legend>
        <b-form-input
          id="password1"
          v-model="v.password.$model"
          :type="pswVisible ? 'text' : 'password'"
          :state="validateState('password')"
          placeholder="Пароль"
          @blur="v.password.$touch()"
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
        <div class="invalid-feedback">
          <b-form-invalid-feedback
            class="d-block"
            v-for="(errMess, index) in errorMessageValidation"
            :key="index"
          >
            {{ errMess.errorText }}
          </b-form-invalid-feedback>
        </div>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-6" v-if="recovery"></div>
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
          type="password"
          :type="pswVisible2 ? 'text' : 'password'"
          autocomplete="new-password"
          v-model="v.password2.$model"
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
        <b-form-invalid-feedback>Пароли не совпадают</b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="col-12 col-lg-6" v-if="recovery"></div>
  </div>
</template>

<script>
import VueEasyTooltip from "vue-easy-tooltip";
import {
  BFormInvalidFeedback,
  BFormInput,
  BFormGroup,
  BCol,
  BRow,
} from "bootstrap-vue";
import ValidationWindow from "./ValidationWindow.vue";
import { tooltipText } from "../../RegForm/regform.helper";

export default {
  props: [
    "v",
    "validateState",
    "disabled",
    "recovery",
    "tabIndex",
    "isValid",
    "logParams",
    "errorMessageValidation",
  ],
  data() {
    return {
      password: "",
      password2: "",
      pswVisible2: false,
      pswVisible: false,
      isUserBlured: true,
      toggleVerifyWindow: true,
    };
  },
  methods: {
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
      this.toggleVerifyWindow = this.validateState(field);
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
    BFormInvalidFeedback,
    BFormInput,
    BFormGroup,
    BCol,
    BRow,
    VueEasyTooltip,
    ValidationWindow,
  },
  computed: {
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
