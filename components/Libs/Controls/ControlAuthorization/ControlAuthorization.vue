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
            :disabled="isPhoneInputDisabled"
            v-model="phoneNumber"
            @input="phoneNumberUpdated"
          />
          <!-- Кнопка запроса СМС -->
          <button
            type="button"
            :disabled="isSendSmsBtnDisabled"
            id="sendSmsButton"
            @click="sendSMS"
          >
            {{ sendSmsBtnName }}
            <VerifyTimer
              v-if="isSendSmsBtnDisabled"
              :duration="duration"
              @onFinish="stopSMSRequest"
            />
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
import controlAuthorizationConstants from "./controlAuthorizationConstants";
import VerifyTimer from "../../VerifyUser/VerifyTimer.vue";

export default {
  name: "ControlAuthorization",
  components: { VerifyTimer },
  computed: {
    controlAuthorizationConstants() {
      return controlAuthorizationConstants;
    },
    authBtnDisabled() {
      return !this.sms;
    },
    authInputDisabled() {
      return !this.smsRequested;
    },
    isSMSRequestInProgress() {
      return true;
    },
    sendSmsBtnName() {
      if (this.isSMSRequestInProgress) {
        return this.controlAuthorizationConstants.sendSMSAgainBtnName;
      }

      return this.controlAuthorizationConstants.sendSMSBtnName;
    },
    phoneNumberNormalize() {
      return controlAuthorizationHelper.getRestructuredPhoneNumber(this.phoneNumber);
    },
  },
  data: () => ({
    isModalVisible: false,
    smsRequested: false,
    phoneNumber: "",
    sms: "",
    isSendSmsBtnDisabled: true,
    isPhoneInputDisabled: false,
    duration: 5,
  }),
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
    },
    sendSMS() {
      const smsData = {
        username: this.phoneNumberNormalize,
        password: null,
        cap: null,
        capid: null,
        mode: 60,
      };
      controlAuthorizationHelper.sentSmsCode(smsData);

      this.startSMSRequest();
    },
    startSMSRequest() {
      this.isPhoneInputDisabled = true;
      this.isSendSmsBtnDisabled = true;
      this.smsRequested = true;
    },
    stopSMSRequest() {
      this.isPhoneInputDisabled = false;
      this.isSendSmsBtnDisabled = false;
    },
    phoneNumberUpdated(ev) {
      this.isSendSmsBtnDisabled = ev.target.value.length === 0;
      this.smsRequested = false;
    },
    auth() {
      const formData = [ ...this.$store.getters("data_card/getForm") ];

      controlAuthorizationHelper.auth(formData);
    },
  },
};
</script>

<style lang="scss" scoped></style>
