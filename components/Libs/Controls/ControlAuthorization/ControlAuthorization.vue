<template>
  <div>
    <div class="main-blk">
      <div
        v-if="data.label != null"
        class="mb-3 lh_text"
      >
        {{ data.label }}
      </div>
      <div class="row">
        <div class="col-auto mb-3">
          <button
            type="button"
            @click="showModal"
            id="btn_osago_form_auth"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="/img/login.svg#ppl"></use>
            </svg>
            Личный кабинет
          </button>
        </div>
        <div
          class="col-auto mb-3"
          @click="goESIA"
        >
          <button
            type="button"
            class="btn-gosuslugi"
            id="btn_osago_form_esia"
          >
            <svg
              width="25"
              height="24"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <use href="/img/login.svg#esia"></use>
            </svg>
            Госуслуги
          </button>
        </div>
      </div>
      <ControlModal
        id="sms-auth-confirm-modal"
        :is-open="isModalVisible"
        :has-footer="false"
        :show-close="true"
        :show-ok="false"
        :show-cancel="false"
        :close-on-out-side-click="true"
        :close-on-esc="true"
        @close="resetForm"
      >
        <template #title> Авторизация </template>

        <div class="form-container">
          <form
            id="authForm"
            @submit.prevent
          >
            <label for="phoneNumber">Введите номер телефона</label>
            <input
              :class="phoneNumberClass"
              ref="phoneNumber"
              id="phoneNumber"
              autofocus
              :disabled="isPhoneNumberDisabled"
              @blur="touchPhoneNumber"
              @keydown="preventForNumberInput"
              @keydown.enter="requestSMS"
              @input="phoneNumberUpdated"
              name="phoneNumber"
              placeholder="+7(___)-___-__-__"
              required
              v-model="phoneNumber"
              v-mask="mask"
            />

            <div
              class="error-block d-block mt-1"
              v-if="wrongAuthData"
            >
              {{ smsErrorMessage }}
            </div>

            <label
              for="smsCode"
              class="mt-3"
              >Введите код подтверждения из СМС</label
            >
            <input
              type="number"
              id="smsCode"
              name="smsCode"
              :class="smsCodeClass"
              @blur="touchSMSCode"
              @keydown="preventForNumberInput"
              @keydown.enter="sendAuthData"
              @input="updateSMSCode"
              placeholder="Введите код из СМС"
              :disabled="isAuthInputDisabled"
              required
              v-model="SMSCode"
            />

            <!-- Кнопка запроса СМС -->
            <button
              type="button"
              class="mt-3"
              :class="{
                'btn-primary': isAuthButtonDisabled,
                'btn-secondary': !isAuthButtonDisabled,
              }"
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

            <!-- Кнопка отправки формы с кодом -->
            <button
              type="button"
              class="btn-primary mt-3"
              id="authButton"
              :disabled="isAuthButtonDisabled"
              @click="sendAuthData"
            >
              Авторизация
            </button>
          </form>

          <div
            v-if="isFormErrorMessage"
            class="error-block d-block mt-3"
          >
            <transition
              name="fade"
              mode="out-in"
            >
              <p
                :key="currentErrorKey"
                v-html="currentErrorMessage"
              />
            </transition>
          </div>
        </div>
      </ControlModal>
    </div>

    <div
      v-if="gosuslugiErrorMessage"
      class="mt-3 error-block"
      id="errorMessage"
    >
      {{ gosuslugiErrorMessage }}
    </div>
  </div>
</template>

<script>
import { mask } from "vue-the-mask";
import controlAuthorizationHelper from "./controlAuthorizationHelper";
import controlAuthorizationConstants from "./controlAuthorizationConstants";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import ControlModal from "../AsyncModalAction/ControlModal";

export default {
  name: "ControlAuthorization",
  components: { VerifyTimer, ControlModal },
  directives: { mask },
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
    placeholder: "+7(___)-___-__-__",
    mask: "+7(9##)-###-##-##",
    duration: 60,
    smsErrorMessage: "Проверьте корректность введенных данных.",
    gosuslugiErrorMessage: null,
    isFormErrorMessage: false,
    verifyTimerKey: 1,
    currentErrorKey: 0,
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
      return !this.isSMSRequested || this.wrongAuthData || this.isAuthDataRequestInProgress;
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
      return controlAuthorizationHelper.getRestructuredPhoneNumber(this.phoneNumber);
    },

    correctPhoneNumber() {
      if (this.phoneNumberNormalize) {
        return this.phoneNumberNormalize.replace(/^\+./, "");
      }
      return this.phoneNumber;
    },

    isPhoneValid() {
      if (this.phoneNumber.length === this.controlAuthorizationConstants.phoneNumberLength) {
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
      if (this.SMSCode?.length === this.controlAuthorizationConstants.smsCodeLength) {
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
      return this.isSMSRequestInProgress || !this.isPhoneValid || this.isAuthDataRequestInProgress;
    },
    currentErrorMessage() {
      return this.saveFormErrorMessages[this.currentErrorKey];
    },
  },
  mounted() {
    this.addLoggedInListener();

    this.gosuslugiErrorMessage = new URLSearchParams(window.location.search).get("error");
  },
  methods: {
    onModalHide() {
      if (this.currentErrorMessage) {
        this.$store.commit("data_card/setErrorMessage", null);
        this.$store.commit("data_card/setAuthModalVisible", false);
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: {},
        });
      }
    },
    addLoggedInListener() {
      window.addEventListener("user-logged-in", (ev) => {
        if (ev.detail) {
          this.afterSaveAction();
        }
      });
    },
    showModal() {
      this.resetForm();
      this.isModalVisible = true;
      this.$store.commit("data_card/setAuthModalVisible", true);
    },
    closeModal() {
      this.isModalVisible = false;
      this.$store.commit("data_card/setAuthModalVisible", false);
    },

    async requestSMS() {
      const smsData = {
        SPHONE: this.correctPhoneNumber,
        ID: null,
      };

      if (this.isSMSButtonDisabled) {
        return;
      }

      this.startSMSRequest();

      const authResp = await controlAuthorizationHelper.requestSmsCode(smsData);

      if (authResp.error) {
        this.smsErrorMessage = authResp.error?.response.data?.INFO ?? this.smsErrorMessage;
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
    phoneNumberUpdated(event) {
      this.touchPhoneNumber();
      this.isSMSRequested = false;
      this.isPhoneNumberUpdated = true;
      this.wrongAuthData = false;
      this.phoneNumber = event.target?.value?.substring(0, this.controlAuthorizationConstants.phoneNumberLength);
      this.SMSCode = "";
      this.isFormErrorMessage = false;
    },
    preventForNumberInput(ev) {
      if (ev.key === "-" || ev.key === "+") {
        ev.preventDefault();
      }
    },
    sendAuthData() {
      if (this.isAuthButtonDisabled) {
        return;
      }

      this.isSendDataInProgress = true;
      this.isAuthDataRequestInProgress = true;

      this.updateStoreValue();
      this.$emit("saveCard", "Auth");
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

      const authSuccessEvent = new window.CustomEvent("auth-success-event", {
        status: true,
      });

      window.dispatchEvent(authSuccessEvent);
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
        value: { code: this.SMSCode, phone: this.correctPhoneNumber },
      });
    },

    touchSMSCode() {
      this.isSmsCodeTouched = true;
    },

    updateSMSCode() {
      this.touchSMSCode();
      this.SMSCode = this.SMSCode.substring(0, this.controlAuthorizationConstants.smsCodeLength);
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
    goESIA() {
      const url = new URL("/sso?auth&type=esia", window.location.origin);
      const currentUrl = new URL(window.location.href);
      url.searchParams.set("ref", encodeURIComponent(currentUrl.pathname + currentUrl.search));
      window.location.href = url.href;
    },
  },
};
</script>

<style scoped>
.bg-auth-success .main-blk {
  background: #edf8ea;
}

.bg-auth-warning .main-blk {
  background: #fff1eb;
}

.bg-auth-error .main-blk {
  background: #ffebeb;
}

.bg-auth-information .main-blk {
  background: #ecf3fa;
}

.bg-auth-grey .main-blk {
  background: #f2f4f5;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

button {
  text-align: center;
  padding: 0 30px !important;
  border-radius: 15px;
  font-size: 1rem;
  line-height: 50px;
  box-sizing: border-box;
  border: 2px solid #ffffff;
  font-weight: 700;
  white-space: nowrap;
  display: inline-block;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 54px !important;
  color: #292929;
  width: 100%;
  background: #fff;
}

.bg-auth-grey .main-blk,
.bg-auth-success .main-blk,
.bg-auth-warning .main-blk,
.bg-auth-error .main-blk,
.bg-auth-information .main-blk {
  border-radius: 16px;
  padding: 24px 20px 0 20px;
}

.mb-minus-3 {
  margin-bottom: -1rem;
}

.error-block {
  background: #ffebeb url(/img/informer-er.svg) left 16px top 12px no-repeat;
  padding: 16px 32px 16px 64px;
  color: #292929;
  border-radius: 16px;
}

button svg {
  margin-right: 10px;
  width: 20px;
  margin-top: -2px;
}

button:hover {
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.08);
  color: #686868;
  transition: 0.3s;
}
.lh_text {
  line-height: 1.25rem;
}
</style>
