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
            type="number"
            :class="phoneNumberClass"
            ref="phoneNumber"
            id="phoneNumber"
            autofocus
            :disabled="isPhoneNumberDisabled"
            @blur="touchPhoneNumber"
            @keydown.enter="requestSMS"
            @input="phoneNumberUpdated"
            name="phoneNumber"
            placeholder="9991234567"
            required
            v-model="phoneNumber"
          />
          <!-- Кнопка запроса СМС -->
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="isSMSButtonDisabled"
            id="sendSmsButton"
            @click="requestSMS"
          >
            {{ sendSmsBtnName }}
            <template v-if="isShowTimer">
              (через
              <VerifyTimer
                :duration="duration"
                @onFinish="stopSMSRequest"
                :key="verifyTimerKey"
              />
              секунд)
            </template>
          </button>

          <div class="error-block d-block mt-3" v-if="wrongAuthData">
            {{ smsErrorMessage }}
          </div>

          <label for="smsCode">Подтверждение СМС</label>
          <input
            type="number"
            id="smsCode"
            name="smsCode"
            :class="smsCodeClass"
            @blur="touchSMSCode"
            @keydown.enter="sendAuthData"
            @input="updateSMSCode"
            placeholder="Введите код из СМС"
            :disabled="isAuthInputDisabled"
            required
            v-model="SMSCode"
          />
          <!-- Кнопка отправки формы с кодом -->
          <button
            type="button"
            class="btn btn-secondary"
            id="authButton"
            :disabled="isAuthButtonDisabled"
            @click="sendAuthData"
          >
            Авторизация
          </button>
        </form>
        <div v-if="isFormErrorMessage" class="error-block d-block mt-3">
          <transition name="fade" mode="out-in">
            <p :key="currentErrorKey" v-html="currentErrorMessage"/>
          </transition>
        </div>
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
  data: () => ({
    isModalVisible: false,
    isSMSRequested: false,
    phoneNumber: "",
    SMSCode: "",
    isSMSRequestInProgress: false,
    isPhoneNumberTouched: false,
    isSmsCodeTouched: false,
    isAuthDataRequestInProgress: false,
    wrongAuthData: false,
    isPhoneNumberUpdated: false,
    isSendDataInProgress: false,
    duration: 60,
    smsErrorMessage: "Проверьте корректность введенных данных.",
    isFormErrorMessage: false,
    verifyTimerKey: 1,
    currentErrorKey: 0,
    isSaveDataInProgress: false,
    saveFormErrorMessages: [
      "Что-то пошло не так &#128557;",
      "Попробуйте повторить попытку позже",
      "Всё обязательно получится!&#128521;",
    ],
  }),
  computed: {
    controlAuthorizationConstants() {
      return controlAuthorizationConstants;
    },
    isAuthInputDisabled() {
      return (
        !this.isSMSRequested ||
        this.wrongAuthData ||
        this.isAuthDataRequestInProgress
      );
    },
    isPhoneNumberDisabled() {
      return this.isAuthDataRequestInProgress;
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

    isAuthButtonDisabled() {
      return (
        this.isPhoneNumberUpdated ||
        !this.isSmsCodeValid ||
        this.wrongAuthData ||
        this.isSendDataInProgress ||
        this.isAuthDataRequestInProgress
      );
    },

    smsCodeClass() {
      const isValid = this.isSmsCodeValid;

      if (isValid === null) {
        return "";
      }

      return isValid ? "is-valid" : "is-invalid";
    },
    isShowTimer() {
      return this.isSMSRequestInProgress;
    },
    isSMSButtonDisabled() {
      return (
        this.isSMSRequestInProgress ||
        !this.isPhoneValid ||
        this.isAuthDataRequestInProgress
      );
    },
    currentErrorMessage() {
      return this.saveFormErrorMessages[this.currentErrorKey];
    },
    isSaveCardInProgress() {
      return this.$store.state.data_card.loading;
    },
  },
  watch: {
    isSaveCardInProgress(val) {
      if (!val && this.isSaveDataInProgress) {
        this.isSaveDataInProgress = false;

        this.afterSaveAction();
      }
    },
  },
  methods: {
    showModal() {
      this.resetForm();
      this.isModalVisible = true;
    },
    closeModal() {
      this.isModalVisible = false;
    },
    async requestSMS() {
      const smsData = {
        SPHONE: this.phoneNumber,
        ID: null,
      };

      this.startSMSRequest();

      const authResp = await controlAuthorizationHelper.requestSmsCode(smsData);

      if (authResp.error) {
        this.smsErrorMessage =
          authResp.error?.response.data?.INFO ?? this.smsErrorMessage;
        this.wrongAuthData = true;
      }
    },
    startSMSRequest() {
      this.isPhoneNumberUpdated = false;
      this.wrongAuthData = false;
      this.isSMSRequested = true;
      this.isSMSRequestInProgress = true;
    },
    stopSMSRequest() {
      this.isSMSRequestInProgress = false;
    },
    phoneNumberUpdated() {
      this.touchPhoneNumber();
      this.isSMSRequested = false;
      this.isPhoneNumberUpdated = true;
      this.wrongAuthData = false;
      this.phoneNumber = this.phoneNumber.substring(0, 10);
      this.SMSCode = "";
      this.isFormErrorMessage = false;
    },
    sendAuthData() {
      this.isSendDataInProgress = true;
      this.isAuthDataRequestInProgress = true;

      this.updateStoreValue();
      this.isSaveDataInProgress = true;
      this.$emit("saveCard");
    },
    afterSaveAction() {
      const isSaveError = this.$store.getters["data_card/getSavedError"];
      const errorMessage = this.$store.getters["data_card/getErrorMessage"];

      this.isAuthDataRequestInProgress = false;
      this.isSendDataInProgress = false;

      if (isSaveError) {
        this.saveFormErrorMessages = [errorMessage];
        this.isFormErrorMessage = true;

        console.error(`sendAuthData: ${errorMessage}`);

        return true;
      }

      this.closeModal();

      return false;
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());

      this.verifyTimerKey += 1;
    },
    updateStoreValue() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: { code: this.SMSCode, phone: this.phoneNumber },
      });
    },

    touchSMSCode() {
      this.isSmsCodeTouched = true;
    },

    updateSMSCode() {
      this.touchSMSCode();
      this.isFormErrorMessage = false;
    },

    touchPhoneNumber() {
      this.isPhoneNumberTouched = true;
    },
    updateFormDataErrorMessage() {
      setTimeout(() => {
        this.currentErrorKey += 1;

        if (this.currentErrorKey + 1 < this.saveFormErrorMessages.length) {
          this.updateFormDataErrorMessage();
        }
      }, 3000);
    },
  },
};
</script>

<style lang="scss" scoped>
.error-block {
  color: #eb5757;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
