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
            @input="phoneNumberUpdated"
          />
          <button
            type="button"
            :disabled="sendSmsBtnDisabled"
            id="sendSmsButton"
            @click="sendSMS"
          >
            {{ sendSmsBtnName }}
            <VerifyTimer
              v-if="smsRequested"
              :duration="duration"
              @onFinish="
                updateSMSRequestState(
                  controlAuthorizationConstants.stopSMSRequestState
                )
              "
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
import VerifyTimer from "@/components/Login/Libs/VerifyUser/VerifyTimer.vue";
import { getRestructuredPhoneNumber } from "@/components/Login/loginForm.helper";

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
      return getRestructuredPhoneNumber(this.phoneNumber);
    }
  },
  data: () => ({
    isModalVisible: false,
    smsRequested: false,
    phoneNumber: "",
    sms: "",
    sendSmsBtnDisabled: true,
    duration: 60,
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
        password: "",
        cap: null,
        capid: null,
        mode: 2
      }
      controlAuthorizationHelper.sentSmsCode(smsData);

      this.updateSMSRequestState(
        this.controlAuthorizationConstants.startSMSRequestState
      );
    },
    updateSMSRequestState(state) {
      if (this.phoneNumber) {
        this.smsRequested = this.controlAuthorizationConstants.startSMSRequestState === state;
        this.sendSmsBtnDisabled = this.controlAuthorizationConstants.startSMSRequestState === state;

        return;
      }

      this.smsRequested = false;
      this.sendSmsBtnDisabled = true;
    },
    phoneNumberUpdated(ev) {
      this.sendSmsBtnDisabled = ev.target.value.length === 0;
    },
    auth() {
    },
  },
};
</script>

<style lang="scss" scoped></style>
