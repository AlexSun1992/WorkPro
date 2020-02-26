<template>
  <div>
    <b-form-group>
      <b-form-input
        v-if="!phoneBlured"
        class="mb-1"
        v-model="v.phone.$model"
        v-mask="mask"
        :placeholder="placeholder"
        :disabled="isPhoneDisabled"
        @blur="phoneFieldValidate"
      ></b-form-input>
      <b-form-input
        v-if="phoneBlured"
        class="mb-1"
        v-model="v.phone.$model"
        v-mask="mask"
        :placeholder="placeholder"
        :state="validateState('phone')"
        :disabled="isPhoneDisabled"
        @input="phoneBlured = false"
      ></b-form-input>
      <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
    </b-form-group>
    <b-link v-if="isPhoneDisabled" @click="changeNumber">Изменить номер</b-link>
    <div ref="codeInput" v-if="code && code.data">
      <p>На указанный номер выслан код подтверждения</p>
      <b-form-input v-if="!codeBlured" v-model="v.code.$model" class="mb-1" v-mask="codeMask" @blur="codeFieldValidate" placeholder="Код подтверждения"></b-form-input>
      <b-form-input v-if="codeBlured" v-model="v.code.$model" class="mb-1" v-mask="codeMask" @input="codeBlured = false" :state="validateState('code')" placeholder="Код подтверждения"></b-form-input>
      <b-form-invalid-feedback v-if="!v.code.$model">Пожалуйста, заполните это поле</b-form-invalid-feedback>
      <b-form-invalid-feedback v-else>Неверный код подтверждения</b-form-invalid-feedback>
      <!-- <b-button
        type="submit"
        v-if="!v.code.$model"
        :disabled="disabledResend"
        @click.prevent="resendCode"
        variant="success"
      >
        Отправить повторно
        <span>{{ resendCount }}</span>
      </b-button> -->
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
    <b-button type="submit" v-if="!code" @click.prevent="getCode" variant="success">Подтвердить</b-button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: ['count', 'v', 'validateState'],
  data() {
    return {
      phone: null,
      code: null,
      isPhoneDisabled: false,
      disabledResend: true,
      // insertedCode: null,
      timer: null,
      initialCount: null,
      resendCount: null,
      isPhoneChanged: false,
      mask: '+7(###)-###-##-##',
      codeMask: '#####',
      placeholder: '+7(___)-___-__-__',
      phoneBlured: false,
      codeBlured: false
    };
  },

  created() {
    debugger
    this.initialCount = this.count;
    this.resendCount = this.count;
  },

  methods: {
     getCode() {
      debugger
      try {
        if (!this.code && this.v.phone.$model) {
          this.isPhoneChanged = false;
          this.resendCount = this.initialCount;
          this.disabledResend = true;
          // Будет изменено на action
          // this.code = await axios.post("/api/password", { phone: this.v.phone.$model });
          this.code = {
            data: '55555'
          }
          console.log(this.$refs);
          debugger
          this.$emit("onCode", this.code);
          this.isPhoneDisabled = true;
          this.countdown();
        } else {
          this.isPhoneDisabled = false;
          this.code = null;
        }
      } catch (e) {
        console.log(e);
      }
    },

    changeNumber() {
      this.phoneBlured = false;
      this.codeBlured = false;
      this.v.phone.$model = '';
      this.code = null;
      this.v.code.$model = null;
      this.isPhoneDisabled = false;
      this.isPhoneChanged = true;
      this.$emit("onCode", this.code);
      this.countdown();
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
      this.resendCount = this.initialCount;
      this.disabledResend = true;
      this.countdown();
    },

    phoneFieldValidate() {
      this.phoneBlured = true;
      this.v.phone.$touch();
    },

    codeFieldValidate() {
      this.codeBlured = true;
      this.v.code.$touch();
    }
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 4px;
}
</style>