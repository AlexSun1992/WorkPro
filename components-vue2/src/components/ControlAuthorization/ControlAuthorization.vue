<template>
  <div>
    <button type="button" @click="showModal">Авторизоваться</button>

    <b-modal
      id="sms-auth-confirm-modal"
      v-model="isModalVisible"
      hide-footer
      :centered="true"
      :static="true"
      content-class="sms-confirm-modal"
      title="Введите код"
    >
      <div class="form-container">
        <h2>Авторизация</h2>
        <form id="authForm">
          <label for="phoneNumber">Номер телефона</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Введите номер телефона"
            required
            v-model="phoneNumber"
          />
          <button
            type="button"
            :disabled="sendSmsBtnDisabled"
            id="sendSmsButton"
            @click="sendSMS"
          >
            Отправить СМС
          </button>

          <label for="smsCode">Подтверждение СМС</label>
          <input
            type="text"
            id="smsCode"
            name="smsCode"
            placeholder="Введите код из СМС"
            :disabled="authInputDisabled"
            required
            v-model="sms"
          />

          <button
            type="submit"
            id="authButton"
            :disabled="authBtnDisabled"
            @click="auth"
          >
            Авторизация
          </button>
        </form>
      </div>
    </b-modal>
  </div>
</template>

<script>
import controlAuthorizationHelper from "./controlAuthorizationHelper";

export default {
  name: "ControlAuthorization",
  components: {},
  computed: {
    authBtnDisabled() {
      return !this.sms;
    },
    sendSmsBtnDisabled() {
      return !this.phoneNumber;
    },
    authInputDisabled() {
      return !this.smsRequested;
    }
  },
  data: () => ({
    isModalVisible: false,
    smsRequested: false,
    phoneNumber: "",
    sms: "",
  }),
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
    },
    sendSMS() {
      controlAuthorizationHelper.getSms();

      this.smsRequested = true;
    },
    auth() {},
  },
};
</script>

<style lang="scss" scoped></style>
