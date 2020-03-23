<template>
  <div>
    <b-form-group>
      <b-form-input
        ref="phoneInput"
        class="mb-1"
        v-model="v.phone.$model"
        v-mask="mask"
        autofocus
        :placeholder="placeholder"
        :state="validateInput('phone', isPhoneBlured)"
        :disabled="isPhoneDisabled || disabled"
        @blur="debouncedUpdate('phone', isPhoneBlured)"
        @input="isPhoneBlured = false"
      ></b-form-input>
      <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
    </b-form-group>
    <b-link v-if="isPhoneDisabled" @click="changeNumber">Изменить номер</b-link>
    <div v-if="code">
      <p>На указанный номер выслан код подтверждения</p>
      <b-form-input
        autofocus
        v-model="v.code.$model"
        class="mb-1"
        v-mask="codeMask"
        :state="validateInput('code', isCodeBlured)"
        @blur="blurField('code', isCodeBlured)"
        @input="isCodeBlured = false"
        :disabled="disabled"
        placeholder="Код подтверждения"
      ></b-form-input>
      <b-form-invalid-feedback v-if="!v.code.$model">Пожалуйста, заполните это поле</b-form-invalid-feedback>
      <b-form-invalid-feedback v-else>Неверный код подтверждения</b-form-invalid-feedback>
      <b-button
        type="submit"
        :disabled="disabledResend"
        @click.prevent="resendCode"
        variant="success"
      >
        Отправить повторно
        <span>{{ resendCount }}</span>
      </b-button>
    </div>
    <b-button
      type="submit"
      v-if="!code"
      :disabled="v.phone.$invalid"
      @click.prevent="getCode"
      variant="success"
    >Подтвердить</b-button>
  </div>
</template>

<script>

import _ from 'lodash'
import axios from 'axios'

export default {
  props: ["count", "v", "validateState", "disabled"],
  data() {
    return {
      isPhoneBlured: true,
      isCodeBlured: true,
      code: null,
      isPhoneDisabled: false,
      disabledResend: true,
      timer: null,
      initialCount: null,
      resendCount: null,
      isPhoneChanged: false,
      mask: "+7(###)-###-##-##",
      codeMask: "#####",
      placeholder: "+7(___)-___-__-__"
    };
  },

  created() {
    this.debouncedUpdate = _.debounce(this.blurField, 100)
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
    async getCode() {
      try {
        debugger
        if (!this.code && this.v.phone.$model) {
          this.resendCount = this.initialCount;
          this.disabledResend = true;
          // this.code = "55555"
          // Перенести в actions
          this.code = await axios.post("/api/password", { phone: this.v.phone.$model });
          this.$emit("onCode", this.code);
          this.isPhoneDisabled = true;
          this.countdown();
        } else {
          this.isPhoneDisabled = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    changeNumber() {
      this.isPhoneBlured = false;
      this.v.phone.$model = "";
      this.$refs["phoneInput"].$el.disabled = false;
      this.$refs["phoneInput"].$el.focus();
      this.code = null;
      this.v.code.$model = null;
      this.isPhoneDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("onCode", this.code);
      this.countdown();
    },

    validateInput(field, bluredField) {
      if (this.v[field].$model && (this.v[field].$model.length === this.v[field].$params.minLength.min) || bluredField) {
        return this.validateState(field);
      }
    },

    blurField(field, bluredField) {
      if (field === 'phone') {
        this.isPhoneBlured = true;
      } else if (field === 'code') {
        this.isCodeBlured = true;
      }
      this.v[field].$touch();  
    },

    countdown() {
      this.resendCount--;
      if (this.resendCount == 0) {
        this.disabledResend = false;
        clearTimeout(this.timer);
        this.resendCount = null;
      } else {
        if (this.isPhoneChanged) {
          this.resendCount = null;
          this.disabledResend = false;
          return;
        }
        this.timer = setTimeout(this.countdown, 1000);
        return this.resendCount;
      }
    },

    resendCode() {
      this.v.code.$model = "";
      this.resendCount = this.initialCount;
      this.disabledResend = true;
      this.countdown();
    }
  }
};
</script>
