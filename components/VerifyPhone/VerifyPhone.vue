<template>
  <div>
    <b-form>
      <b-form-group label="Телефон" label-for="input-1">
        <b-form-input
          id="input-1"
          ref="phone"
          v-mask="'(###)-###-##-##'"
          v-model="phone"
          placeholder="Введите номер телефона"
          :disabled="isPhoneDisabled"
        ></b-form-input>
      </b-form-group>
      <b-link v-if="isPhoneDisabled" @click="changeNumber">Изменить номер</b-link>
      <div v-if="code && code.data">
        <p>На указанный номер выслан код подтверждения</p>
        <b-form>
          <b-form-group>
            <b-form-input
              v-mask="'######'"
              v-model="insertedCode"
              placeholder="Код подтверждения"
            ></b-form-input>
          </b-form-group>
          <b-button
            type="submit"
            v-if="!insertedCode"
            :disabled="disabledResend"
            @click.prevent="resendCode"
            variant="success"
          >
            Отправить повторно
            <span>{{ resendCount }}</span>
          </b-button>
        </b-form>
      </div>
    </b-form>
    <b-button type="submit" v-if="!code" @click.prevent="getCode" variant="success">Подтвердить</b-button>
    <!-- <b-button type="submit" v-if="insertedCode" variant="success">Продолжить</b-button> -->
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import axios from "axios";

@Component({
  name: "LoginModal"
})
export default class PasswordReset extends Vue {
  @Prop({ default: 10 }) count;

  phone: string | null = null;
  code: {} | null = null;
  isPhoneDisabled: boolean = false;
  newPassword: string = "";
  repeatPassword: string | null = "";
  disabledResend: boolean = true;
  insertedCode: string | null = null;
  timer: any = null;
  initialCount: number | null = null;
  resendCount: any = null;
  isPhoneChanged: boolean = false;

  created() {
    this.initialCount = this.count;
    this.resendCount = this.count;
  }

  async getCode() {
    try {
      if (!this.code && this.phone) {
          this.isPhoneChanged = false;
          this.resendCount = this.initialCount;
          this.disabledResend = true;
        // Будет изменено на action
        this.code = await axios.post("/api/password", { phone: this.phone });
        this.$emit('onCode', this.code);
        this.isPhoneDisabled = true;
        this.countdown();
      } else {
        this.isPhoneDisabled = false;
        this.code = null;
      }
    } catch (e) {
      console.log(e);
    }
  }

  changeNumber() {
    this.code = null;
    this.insertedCode = null;
    this.isPhoneDisabled = false;
    this.isPhoneChanged = true;
    this.$emit('onCode', this.code, this.insertedCode);
    this.countdown();
  }

  verifyCode() {
    // Action для верификации code
  }

  countdown() {
    this.resendCount--;
    if (this.resendCount == 0) {
      this.disabledResend = false;
      clearTimeout(this.timer);
      this.resendCount = null;
    } else {
        if(this.isPhoneChanged) {
            this.resendCount = null;
            this.disabledResend = false;
            return;
        };
      this.timer = setTimeout(this.countdown, 1000);
      return this.resendCount;
    }
  }

  resendCode() {
    this.resendCount = this.initialCount;
    this.disabledResend = true;
    this.countdown();
  }
}
</script>

<style scoped>
  .form-group {
    margin-bottom: 4px;
  }
</style>