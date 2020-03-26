<template>
  <div>
    <p>{{label}}</p>
    <b-form-group>
      <b-form-input
        ref="userInput"
        class="mb-1"
        v-model="v[loginType].$model"
        v-mask="changeMask"
        autofocus
        :placeholder="placeholder"
        :state="validateInput(loginType, isUserBlured)"
        :disabled="isUserDisabled || disabled"
        @blur="debouncedUpdate(loginType, isUserBlured)"
        @input="isUserBlured = false"
      ></b-form-input>
      <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
    </b-form-group>
    <div>
      <b-link v-if="isUserDisabled" @click="changeNumber">Изменить номер</b-link>
      <div v-if="(code || userFormValid) && loginType === 'phone'">
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
    </div>
    <UserRecoveryForm v-if="greater180 && context !== 'registration' && !userFormValid && !isPhoneChanged" :v="$v.user" :validateState="validateState" />
    <b-button
      type="submit"
      v-if="!code && loginType === 'phone' && !userFormValid"
      :disabled="v.phone.$invalid"
      @click.prevent="verifyUser"
      variant="success"
    >Подтвердить</b-button>
  </div>
</template>

<script>

import _ from 'lodash'
import axios from 'axios'
import UserRecoveryForm from '~/components/Pages/Login/PasswordRecovery/UserRecoveryForm'
import { required, minLength } from "vuelidate/lib/validators";

export default {
  props: ["count", "v", "validateState", "disabled", "loginType", "label", "context"],
  components: {
    UserRecoveryForm
  },
  data() {
    return {
      isUserBlured: true,
      isCodeBlured: true,
      code: null,
      isUserDisabled: false,
      disabledResend: true,
      timer: null,
      initialCount: null,
      resendCount: null,
      isPhoneChanged: false,
      mask: "",
      codeMask: "#####",
      placeholder: "+7(___)-___-__-__",
      greater180: false, // Заменить на реальные данные
      user: {
        surname: "",
        name: "",
        patronymic: "",
        birthdate: "",
      },
      userFormValid: false
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
        if (!this.code && this.v.phone.$model) {
          this.resendCount = this.initialCount;
          this.disabledResend = true;
          // Перенести в actions
          this.code = await axios.post("/api/password", { phone: this.v.phone.$model });
          this.$emit("onCode", this.code);
          this.isUserDisabled = true;
          this.countdown();
        } else {
          this.isUserDisabled = false;
        }
      } catch (e) {
        console.log(e);
      }
    },

    async showForm() {
      if (!this.$v.user.$invalid) {
        this.userFormValid = true;
        this.isUserDisabled = true;
        this.countdown();
      }
    },

    verifyUser(){
      this.greater180 = true; // Заменить на реальные данные
      if(this.greater180 && this.context !== 'registration') {
        this.showForm();
      } else {
        this.getCode();
      }
    },

    changeNumber() {
      this.userFormValid = false;
      this.isUserBlured = false;
      this.v.phone.$model = "";
      this.$refs["userInput"].$el.disabled = false;
      this.$refs["userInput"].$el.focus();
      this.code = null;
      this.v.code.$model = null;
      this.isUserDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("onCode", this.code);
      this.countdown();
    },

    validateInput(field, bluredField) {
      if( this.v[field].$params.minLength) {
        if (this.v[field].$model && (this.v[field].$model.length === this.v[field].$params.minLength.min) || bluredField) {
          return this.validateState(field);
        }
      }
    },

    blurField(field, bluredField) {
      if (field === 'phone') {
        this.isUserBlured = true;
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
  },

  computed: {
    changeMask() {
      if (this.loginType === 'phone') {
        this.placeholder = "+7(___)-___-__-__"
        return this.mask = "+7(###)-###-##-##"
      } else {
        this.placeholder = "";
        return this.mask = "X".repeat(50);
      }
    }
  },

  validations: {
    user: {
      surname: {
        required
      },
      name: {
        required
      },
      patronymic: {
        required
      },
      birthdate: {
        required
      }
    }
  }
};
</script>
