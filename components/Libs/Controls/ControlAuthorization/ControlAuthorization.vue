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
            v-model="phoneNumber"
          />
          <!-- Кнопка запроса СМС -->
          <button
            type="button"
            class="btn btn-secondary"
            :disabled="isSMSButtonDisabled"
            id="sendSmsButton"
            @click="sendSMS"
          >
            {{ sendSmsBtnName }}
            <template v-if="isShowTimer">
              (через
              <VerifyTimer :duration="duration" @onFinish="stopSMSRequest" />
              секунд)
            </template>
          </button>

          <div class="d-block mt-3" v-if="wrongAuthData">
            Проверьте корректность введенных данных.
          </div>

          <label for="smsCode">Подтверждение СМС</label>
          <input
            type="number"
            id="smsCode"
            name="smsCode"
            :class="smsCodeClass"
            @blur="touchSMSCode"
            @keydown.enter="sendAuthData"
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
            :disabled="isAuthButtonDisabled"
            @click="sendAuthData"
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
    authInputDisabled() {
      return !this.isSMSRequested || this.wrongAuthData;
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
        this.isPhoneNumberUpdated || !this.isSmsCodeValid || this.wrongAuthData || this.isSendDataInProgress
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
      return this.isSMSRequestInProgress || !this.isPhoneValid;
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
    wrongAuthData: false,
    isPhoneNumberUpdated: false,
    isSendDataInProgress: false,
    duration: 60,
  }),
  methods: {
    showModal() {
      this.isModalVisible = true;
    },
    hideModal() {
      this.isModalVisible = false;
    },
    async sendSMS() {
      // TODO Удалить HARDCODE и убрать комментарий. Либо вставить новий объект если появится новый запрос
/*      const HARDCODE = {
        username: this.phoneNumberNormalize,
        password: "485381",
        cap: null,
        capid: null,
        mode: 2,
      }; */
      const smsData = {
        SPHOLDER_PHONE: this.phoneNumberNormalize,
        ID: null,
      };
      this.isPhoneNumberUpdated = false;
      this.startSMSRequest();

      const authResp = await controlAuthorizationHelper.requestSmsCode(smsData);

      if (authResp.error) {
        // TODO это блокировка ввода кода СМС если запрос завершился ошибкой
        // this.wrongAuthData = true;
      }
    },
    startSMSRequest() {
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
      this.SMSCode = "";
    },
    async sendAuthData() {
      if (!this.SMSCode) {
        return;
      }

      this.isSendDataInProgress = true;
      this.updateStoreValue();

      await controlAuthorizationHelper.saveCard();

      this.isSendDataInProgress = false;
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
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

    touchPhoneNumber() {
      this.isPhoneNumberTouched = true;
    },
  },
};
</script>

<style lang="scss" scoped></style>
