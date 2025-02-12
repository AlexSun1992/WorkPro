<template>
  <div>
    <button type="button" class="btn btn-secondary" @click="showModal">
      Авторизоваться
    </button>

    <b-modal
      id="sms-auth-confirm-modal"
      v-model="isModalVisible"
      hide-footer
      @close="resetForm"
      :centered="true"
      :static="true"
      content-class="sms-confirm-modal"
      title="Введите код"
    >
      <div class="form-container" v-if="isModalVisible">
        <h2>Авторизация</h2>
        <form id="authForm">
          <label for="phoneNumber">Номер телефона</label>
          <input
            type="tel"
            :class="phoneNumberClass"
            ref="phoneNumber"
            id="phoneNumber"
            autofocus
            @blur="touchPhoneNumber"
            @keydown.enter="sendSMS"
            @input="phoneNumberUpdated"
            name="phoneNumber"
            placeholder="Введите номер телефона"
            required
            :disabled="isPhoneInputDisabled"
            v-model="phoneNumber"
          />
          <!-- Кнопка запроса СМС -->
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="!isPhoneValid"
            id="sendSmsButton"
            @click="sendSMS"
          >
            {{ sendSmsBtnName }}
            <VerifyTimer
              v-if="isSMSRequestInProgress"
              :duration="duration"
              @onFinish="stopSMSRequest"
            />
          </button>

          <label for="smsCode">Подтверждение СМС</label>
          <input
            type="number"
            id="smsCode"
            name="smsCode"
            :class="smsCodeClass"
            @blur="touchSMSCode"
            @keydown.enter="auth"
            @input="touchSMSCode"
            placeholder="Введите код из СМС"
            :disabled="authInputDisabled"
            required
            v-model="SMSCode"
          />

          <button
            type="button"
            class="btn btn-secondary"
            id="authButton"
            :disabled="!isSmsCodeValid"
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
  props: {
    data: {
      type: Object,
      default: () => ({
        fieldId: "",
        name: "",
        value: "",
      }),
    },
  },
  computed: {
    controlAuthorizationConstants() {
      return controlAuthorizationConstants;
    },
    authBtnDisabled() {
      return !this.SMSCode;
    },
    authInputDisabled() {
      return !this.isSMSRequested;
    },
    sendSmsBtnName() {
      if (this.isSMSRequested) {
        return this.controlAuthorizationConstants.sendSMSAgainBtnName;
      }

      return this.controlAuthorizationConstants.sendSMSBtnName;
    },
    phoneNumberNormalize() {
      return controlAuthorizationHelper.getRestructuredPhoneNumber(
        this.phoneNumber
      );
    },
    isPhoneValid() {
      if (this.phoneNumber) {
        return true;
      }

      if (this.isPhoneNumberTouched) {
        return false;
      }

      return null;
    },
    phoneNumberClass() {
      const isValid = this.isPhoneValid;

      if (isValid === null) {
        return "";
      }

      return isValid ? "is-valid" : "is-invalid";
    },

    isSmsCodeValid() {
      if (this.SMSCode) {
        return true;
      }

      if (this.isSmsCodeTouched) {
        return false;
      }

      return null;
    },

    smsCodeClass() {
      const isValid = this.isSmsCodeValid;

      if (isValid === null) {
        return "";
      }

      return isValid ? "is-valid" : "is-invalid";
    },
  },
  data: () => ({
    isModalVisible: false,
    isSMSRequested: false,
    phoneNumber: "",
    SMSCode: "",
    isSendSMSBtnDisabled: true,
    isPhoneInputDisabled: false,
    isSMSRequestInProgress: false,
    isPhoneNumberTouched: false,
    isSmsCodeTouched: false,
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
      this.isSendSMSBtnDisabled = true;
      this.isSMSRequested = true;
      this.isSMSRequestInProgress = true;
    },
    stopSMSRequest() {
      this.isPhoneInputDisabled = false;
      this.isSendSMSBtnDisabled = false;
      this.isSMSRequestInProgress = false;
    },
    phoneNumberUpdated(ev) {
      this.touchPhoneNumber();
      this.isSendSMSBtnDisabled = ev.target.value.length === 0;
      this.isSMSRequested = false;
    },
    auth() {
      if (!this.SMSCode) {
        return;
      }

      this.updateStoreValue();

      controlAuthorizationHelper.auth([
        ...this.$store.getters("data_card/getForm"),
      ]);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
    },
    updateStoreValue() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.SMSCode,
      });
    },

    touchSMSCode() {
      this.isSmsCodeTouched = true;
    },

    touchPhoneNumber() {
      this.isPhoneNumberTouched = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
