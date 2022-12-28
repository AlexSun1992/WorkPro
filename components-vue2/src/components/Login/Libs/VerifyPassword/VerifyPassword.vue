<template>
  <div class="row mt-3">
    <b-col sm="12" lg="6">
      <b-form-group :label="showLabel" label-cols="12" class="required">
        <b-form-input
          id="password1"
          type="password"
          v-model="v.password.$model"
          :state="validateState('password')"
          placeholder="Пароль"
          @blur="v.password.$touch()"
          autocomplete="new-password"
          :disabled="disabled"
          @update="updateField('password')"
        ></b-form-input>
        <b-form-invalid-feedback
          >Пароль должен содержать от {{ minLength }} до
          {{ maxLength }} символов</b-form-invalid-feedback
        >
      </b-form-group>
    </b-col>
    <b-col sm="12" lg="6" v-if="recovery"></b-col>
    <b-col
      class="password-repeat mt-3 mt-lg-0"
      :class="{ 'mt-0': recovery }"
      sm="12"
      lg="6"
    >
      <b-form-group
        :label="'Повторите пароль'"
        label-cols="12"
        class="required"
      >
        <b-form-input
          id="password2"
          type="password"
          autocomplete="new-password"
          v-model="v.password2.$model"
          :state="validateState('password2')"
          placeholder="Повторите пароль"
          @blur="v.password2.$touch()"
          :disabled="disabled"
          @update="updateField('password2')"
        ></b-form-input>
        <b-form-invalid-feedback>Пароли не совпадают</b-form-invalid-feedback>
      </b-form-group>
    </b-col>
    <b-col sm="12" v-if="recovery"></b-col>
  </div>
</template>

<script>
import {
  BFormInvalidFeedback,
  BFormInput,
  BFormGroup,
  BCol,
  BRow,
} from "bootstrap-vue";
import {
  minLengthPassword,
  maxLengthPassword,
} from "../../RegForm/regform.helper.fixtures";

export default {
  props: [
    "v",
    "validateState",
    "disabled",
    "recovery",
    "tabIndex",
    "isValid",
    "logParams",
  ],
  data() {
    return {
      minLength: minLengthPassword,
      maxLength: maxLengthPassword,
      password: "",
      password2: "",
    };
  },

  methods: {
    changeField(field) {
      this.$LogEvent({
        ...this.logParams,
        controlName: field,
        message: `Поле ${field} посещено`,
        timeUser: new Date(),
      });
    },
    updateField(field) {
      this.$emit("change", this.v[field].$model);
    },
  },
  components: {
    BFormInvalidFeedback,
    BFormInput,
    BFormGroup,
    BCol,
    BRow,
  },
  computed: {
    showLabel() {
      return this.recovery ? "Придумайте новый пароль" : "Пароль";
    },
  },
};
</script>

<style scoped></style>
