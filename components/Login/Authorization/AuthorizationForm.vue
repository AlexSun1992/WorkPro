<template>
  <div>
    <dialog
      ref="modal"
      class="login-modal"
      @close="handleClose"
    >
      <div ref="wrapper">
        <BrandLoader url="/img/loader.json" />

        <button
          class="close"
          @click="handleClose"
          v-if="currentComponent !== 'AuthorizationSMSCode'"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <use href="/img/login.svg#close"></use>
          </svg>
        </button>
        <component
          :is="currentComponent"
          :options="options"
          :userData="userData"
          @componentStep="handleComponentStep"
          @submit="handleSubmit"
          @input="handlePhoneInput"
          @blur="handleBlur"
          @updateFields="updateFields"
        />
      </div>
    </dialog>
  </div>
</template>

<script>
import { ref, reactive, computed, getCurrentInstance, watch, onMounted, onUnmounted } from "vue";
import axios from "axios";
import Cookies from "js-cookie";
import { getErrorMessage } from "@/utils/transform";
import AuthorizationSMSCode from "./AuthorizationSMSCode";
import AuthorizationPhone from "./AuthorizationPhone";
import AuthorizationBirthdate from "./AuthorizationBirthdate";
import RegistrationForm from "@/components/Login/Registration/RegistrationForm";
import BrandLoader from "@/components/Libs/Controls/ControlBrandLoader/BrandLoader";
// eslint-disable-next-line import/extensions
import { getRestructuredPhoneNumber } from "@/components/Login/loginForm.helper";

export default {
  name: "AuthorizationForm",
  components: {
    AuthorizationPhone,
    AuthorizationSMSCode,
    AuthorizationBirthdate,
    BrandLoader,
    RegistrationForm,
  },
  setup() {
    const instance = getCurrentInstance();
    const modal = ref(null);
    const wrapper = ref(null);
    const currentStep = ref("phone");
    const exStep = ref("");
    const authInProcess = ref(false);
    const store = instance.proxy.$store;

    const options = reactive({
      informerText: "",
      statusObject: "",
      modalTextRequest: "",
      errorInput: "",
      title: "",
      isValidStateCodeSMS: null,
      isRetrySendCodeSMS: false,
      isCaptchaNeeded: false,
      captchaMessage: null,
      duration: 60,
      isDisabled: false,
      mask: "",
      placeholder: "",
    });

    const userData = reactive({
      username: "",
      code: "",
      capId: "",
      cap: "",
      registration: {},
    });

    const registrationFetchData = ref({});

    const currentComponent = computed(
      () =>
        ({
          phone: AuthorizationPhone,
          sms: AuthorizationSMSCode,
          birthdate: AuthorizationBirthdate,
          registration: RegistrationForm,
        }[currentStep.value] || null)
    );

    const isModalOpen = computed(() => store.getters["auth/isAuthorizationModal"]);
    const escPressed = (event) => {
      if (event.code !== "Escape") return;
      event.preventDefault();
      handleClose();
    };

    const handleClose = () => {
      if (modal.value?.close) {
        modal.value.close();
      }
      currentStep.value = "phone";
      userData.username = "";
      clearData();
      store.commit("auth/setAuthorizationModal", false);
    };

    const openModal = () => {
      if (modal.value?.showModal) {
        modal.value.showModal();
        store.commit("auth/setAuthorizationModal", true);
      }
    };

    watch(currentStep, (newStep, oldStep) => {
      if (oldStep && oldStep !== newStep) {
        exStep.value = oldStep;
      }
    });

    watch(isModalOpen, (newVal) => {
      if (!modal.value) return;
      if (newVal) {
        openModal();
      } else {
        handleClose();
      }
    });

    const text = ref("");
    const isInvalidPhone = ref(false);

    const updateFields = (event) => {
      userData.registration = event;
      userData.username = event.phone;
    };

    const handleBlur = (event) => {
      userData.username = event;
      options.errorInput = "";
      prepareAuthRequestData();
    };

    const clearData = () => {
      userData.code = "";
      userData.capId = "";
      userData.cap = "";
      userData.registration = {};
      options.informerText = "";
      options.statusObject = "";
      options.placeholder = "";
      options.modalTextRequest = "";
      options.errorInput = "";
      options.title = "";
      options.isValidStateCodeSMS = null;
      options.isRetrySendCodeSMS = false;
      options.isCaptchaNeeded = false;
      options.captchaMessage = null;
      options.isDisabled = false;
      options.mask = "";
    };

    const handleComponentStep = (step) => {
      if (step !== "registration") clearData();
      currentStep.value = step;
    };

    const handleSubmit = (user) => {
      if (currentStep.value === "phone") userData.username = user;
      if (currentStep.value === "sms") userData.code = user;
      if (currentStep.value === "birthdate") userData.birthdate = user;
      if (currentStep.value === "registration") {
        registrationFetchData.value = user;
      }
      fetchToken();
    };

    const handlePhoneInput = (event) => {
      userData.username = event.target.value;
    };

    const formatDateObject = (date) => {
      if (!date) return "";
      if (typeof date === "string") return date;

      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };

    const saveCookies = (accessToken, refreshToken) => {
      Cookies.set("auth._token.local", `Bearer ${accessToken}`, {
        expires: 1 / 24,
      });
      Cookies.set("auth._refresh_token.local", refreshToken, { expires: 365 });
      Cookies.set("auth._token_expiration.local", Date.now() + 100000);
    };

    const authRedirect = () => {
      authInProcess.value = true;
      const currentLocation = new URL(window.location.href);
      const searchParamsRef = currentLocation.searchParams.get("ref");
      const cookiesRef = Cookies.get("ref");
      window.location.href = searchParamsRef || cookiesRef || "/cabinet";
    };

    const logAuthEvent = () => {
      if (instance?.proxy?.$LogEvent) {
        instance.proxy.$LogEvent({
          formName: "Authorization",
          idEventType: userData.code ? 45 : 4,
          controlName: "Button",
          message: `Нажал на кнопку "${userData.code ? "Продолжить" : "Авторизоваться"}"`,
          timeUser: new Date(),
        });
      }
    };

    const prepareAuthRequestData = () => {
      let body;
      isInvalidPhone.value = false;
      const getValidPhoneNumber = getRestructuredPhoneNumber(userData.username);
      const getValidPhoneNumberReg = userData.username ? getRestructuredPhoneNumber(userData.username) : "";

      if (!getValidPhoneNumber && userData.username?.length < 18) {
        options.errorInput = "Вы ввели номер не полностью";
        isInvalidPhone.value = true;
      }
      if (!getValidPhoneNumber && userData.username?.length === 18) {
        options.errorInput = "Вы ввели неправильный номер";
        isInvalidPhone.value = true;
      }
      body = {
        CODE: userData.code,
        MODE: 2,
        VERSION: 2,
        USERNAME:
          typeof getValidPhoneNumber === "string" && getValidPhoneNumber?.startsWith("+")
            ? getValidPhoneNumber.slice(2)
            : getValidPhoneNumber,
      };
      if (userData.birthdate !== "" && currentComponent.value.name !== "RegistrationForm") {
        body.DOP = formatDateObject(userData.birthdate);
      }

      if (
        isRegistrationSMSMode.value ||
        (currentComponent.value.name === "RegistrationForm" && getValidPhoneNumberReg)
      ) {
        body = {
          ...registrationFetchData.value,
          CODE: userData.code,
          VERSION: 2,
          PHONE: getValidPhoneNumberReg.startsWith("+") ? getValidPhoneNumberReg.slice(2) : getValidPhoneNumberReg,
        };
      }

      return {
        body,
        headers: { headers: { "X-Application": "VueJS" } },
      };
    };

    const handleSuccessResponse = (response) => {
      const { ACCESS_TOKEN, REFRESH_TOKEN } = response.data;

      if (ACCESS_TOKEN && REFRESH_TOKEN) {
        options.errorInput = "";
        options.informerText = "";
        options.modalTextRequest = "";
        options.statusObject = "";

        saveCookies(ACCESS_TOKEN, REFRESH_TOKEN);
        authRedirect();
      }
    };

    const handleSpecificErrors = (data) => {
      const { CODENAME, CODE, ERROR, LABEL, MESSAGE, INFO } = data;

      if (!CODENAME && CODE === undefined) return false;

      const errorHandlers = {
        CaptchaRequest: () => {
          options.isCaptchaNeeded = true;
          return true;
        },

        CodeCallRequest: () => handleCodeRequest(data),
        CodeVoiceRequest: () => handleCodeRequest(data),
        CodeSmsRequest: () => handleCodeRequest(data),
        Registration: () => {
          currentStep.value = "registration";
        },

        DopFactor: () => {
          currentStep.value = "birthdate";
          updateOptions(LABEL, MESSAGE, INFO, ERROR);
          return true;
        },

        InvalidPhoneCode: () => {
          options.isValidStateCodeSMS = false;
          return true;
        },
      };

      if (CODENAME && errorHandlers[CODENAME]) {
        return errorHandlers[CODENAME]();
      }

      return handleByErrorCode(CODE, data);
    };

    const handleCodeRequest = (data) => {
      const { CODE, LABEL, MESSAGE, INFO, ERROR } = data;
      currentStep.value = "sms";
      const codeToMaskMap = {
        104: "#####",
        110: "####",
        108: "####",
      };

      options.mask = codeToMaskMap[CODE] || options.mask;
      options.placeholder = options.mask.length === 4 ? "Код подтверждения" : "Код из СМС";
      updateOptions(LABEL, MESSAGE, INFO, ERROR);

      if (modal.value) {
        openModal();
      }

      return true;
    };

    const updateOptions = (title, modalTextRequest, informerText, errorInput) => {
      options.title = title || "";
      options.modalTextRequest = modalTextRequest || "";
      options.informerText = informerText || "";
      options.errorInput = errorInput || "";
    };

    const handleByErrorCode = (code, data) => {
      const codeHandlers = {
        105: () => {
          options.isValidStateCodeSMS = false;
          userData.code = "";
          return true;
        },
        401: () => true,
      };

      if (code !== undefined && codeHandlers[code]) {
        return codeHandlers[code]();
      }

      if (data.ERROR) {
        options.errorInput = data.ERROR;
      }

      return false;
    };

    const handleCommonErrors = (error) => {
      if (!error.response) {
        options.informerText = getErrorMessage(error);
        return true;
      }

      const { data } = error.response;

      if (!data) {
        options.informerText = getErrorMessage(error);
        return true;
      }

      return false;
    };

    const handleShowError = (data) => {
      if (["Error", "ShowError"].includes(data.CODENAME)) {
        options.informerText = data.INFO;
        options.errorInput = data.ERROR;
        options.statusObject = "SERROR_INFO";
        options.modalTextRequest = data.MESSAGE;
        return true;
      }
      return false;
    };

    const handleFetchError = (data, error = {}) => {
      authInProcess.value = false;
      if (!data) {
        return;
      }
      if (handleSpecificErrors(data)) {
        return;
      }
      if (handleShowError(data)) {
        return;
      }
      options.modalTextRequest = getErrorMessage(data.MESSAGE);
      handleCommonErrors(error);
    };
    const isRegistrationSMSMode = computed(
      () => exStep.value === "registration" && currentComponent.value.name === "AuthorizationSMSCode"
    );

    const fetchToken = async () => {
      logAuthEvent();
      options.errorInput = "";
      options.informerText = "";
      options.statusObject = "";

      if (userData.username === "") {
        return;
      }

      try {
        authInProcess.value = true;
        const requestData = prepareAuthRequestData();
        const isRegistration = currentComponent.value.name === "RegistrationForm";
        if (isInvalidPhone.value) return;

        store.commit("ui/loader/setShowLoader", true);

        const url = isRegistrationSMSMode.value || isRegistration ? "/lk/free/v2/registerUser1" : "/lk/authw/v2/auth";
        const response = await axios.post(url, requestData.body, requestData.headers);
        if (
          exStep.value !== "registration" &&
          currentComponent.value.name !== "AuthorizationBirthdate" &&
          !isRegistration
        ) {
          if (response.data?.ACCESS_TOKEN && response.data?.REFRESH_TOKEN) {
            handleSuccessResponse(response);
          }
        } else {
          const isErrorList = Boolean(response?.data?.ERRORLIST);

          if (isErrorList === false) {
            handleComponentStep("phone");
            handleFetchError(response?.data[0] || response?.data);
          }
        }
        store.commit("ui/loader/setShowLoader", false);
      } catch (error) {
        handleFetchError(error?.response?.data, error);
        store.commit("ui/loader/setShowLoader", false);
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", escPressed);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", escPressed);
    });

    return {
      text,
      wrapper,
      currentStep,
      fetchToken,
      modal,
      options,
      userData,
      currentComponent,
      handleComponentStep,
      handleClose,
      handleSubmit,
      handlePhoneInput,
      updateFields,
      handleBlur,
    };
  },
};
</script>
<style scoped>
.login-modal {
  width: 480px;
  border-radius: 24px;
  border: 0;
  padding: 0;
}

.login-modal > div {
  padding: 24px 32px;
}

.login-modal .close {
  border: 0;
  position: absolute;
  font-size: 0;
  top: 24px;
  right: 32px;
  width: 24px;
  height: 24px;
  padding: 0;
  background: transparent;
}

.login-modal::v-deep .overlay {
  position: fixed;
  inset: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(239, 239, 240, 0.6);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events: all;
}

.login-modal::v-deep .vue-lottie-player {
  position: relative;
  background: transparent;
  border-radius: 30px;
  width: 200px;
  height: 200px;
  box-shadow: none;
}

.login-modal::v-deep .vue-lottie-player:after {
  content: "";
  width: 132px;
  height: 132px;
  border-radius: 30px;
  box-shadow: 0px 6px 30px 0px rgba(28, 28, 28, 0.16);
  position: absolute;
  top: 36px;
  left: 34px;
  display: block;
  z-index: -1;
  background-color: #fff;
}

.login-modal::v-deep .vue-lottie-player .lf-spinner {
  display: none;
}

@media (max-width: 576px) {
  .login-modal {
    max-width: 100%;
    bottom: 0;
    top: auto;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }

  .login-modal > div {
    padding: 48px 16px 16px 16px;
  }
  .login-modal .close {
    top: 8px;
    right: 16px;
  }
}
</style>
