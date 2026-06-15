<template>
  <div>
    <div class="login-header">
      <div class="login-header-title">
        {{ options.title }}
        <span>{{ options.modalTextRequest }}</span>
      </div>
    </div>
    <form
      id="sms-form"
      @submit.prevent="onSubmitWithCodeSMS"
    >
      <div>
        <RInput
          ref="focusCodeSMS"
          v-model="user"
          :mask="options.mask"
          type="text"
          :state="validClass"
          :error-input-text="options.errorInput"
          autofocus
          :label="options.placeholder"
          name="sms-code"
          :disabled="authInProcess"
          data-testid="authSMSCode"
          required
        />
      </div>
      <button
        v-if="!isRetrySendCodeSMS"
        type="button"
        disabled
        class="sms_code"
      >
        Отправить код (через
        <verify-timer
          :duration="duration"
          @onFinish="isRetrySendCodeSMS = true"
        />
        секунд)
      </button>

      <button
        v-if="isRetrySendCodeSMS"
        class="sms_code"
        type="button"
        :disabled="authInProcess"
        @click="retrySendCodeSMS"
      >
        Отправить код повторно
      </button>

      <button
        class="back"
        type="button"
        @click="handleBack"
      >
        <img
          class="mr-2"
          width="24"
          height="24"
          src="/img/login.svg#back"
        />
        Назад
      </button>
    </form>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import VerifyTimer from "@/components/Libs/VerifyUser/VerifyTimer";
import RInput from "./RInput";

export default {
  name: "AuthorizationSMSCode",
  components: {
    VerifyTimer,
    RInput,
  },
  props: {
    userData: {
      type: Object,
      default: () => {},
    },
    options: {
      type: Object,
      default: () => {},
    },
  },
  emits: ["submit", "componentStep"],
  setup(props, { emit }) {
    const user = ref(props.userData.code || "");

    const isRetrySendCodeSMS = ref(props.options.isRetrySendCodeSMS || false);

    const validClass = computed(
      () => !(props.options.errorInput?.length || props.options.statusObject === "SERROR_INFO")
    );

    const duration = computed(() => props.options.duration || 60);

    const authInProcess = computed(() => props.options.authInProcess || false);

    watch(user, (newVal, oldVal) => {
      if (newVal.length === props.options.mask.length && newVal !== oldVal) {
        fetchToken();
      }
    });

    const onSubmitWithCodeSMS = () => {
      if (user.value !== "") {
        fetchToken();
      }
    };
    const handleBack = () => {
      emit("componentStep", "phone");
    };
    const retrySendCodeSMS = () => {
      isRetrySendCodeSMS.value = false;
      user.value = "";
      emit("submit", "");
    };
    const fetchToken = () => {
      emit("submit", user.value);
    };

    return {
      user,
      isRetrySendCodeSMS,
      duration,
      authInProcess,
      validClass,
      handleBack,
      onSubmitWithCodeSMS,
      retrySendCodeSMS,
    };
  },
};
</script>

<style scoped>
.login-header {
  display: grid;
  grid-template-columns: 100% 40px;
  margin-bottom: 32px;
}
.login-header-title {
  font-weight: 600;
  font-size: 1.5rem;
  line-height: 2rem;
  color: #292929;
}
.login-header-title span {
  display: block;
  margin-top: 8px;
  color: #686868;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1.5rem;
}

.input-box input:hover,
.input-box input {
  height: 56px;
  background-color: #f2f4f5;
  border-radius: 16px !important;
  color: #292929;
  caret-color: #43b02a;
  border: 2px solid #f2f4f5;
  padding: 20px 20px 0;
}

.input-box input:focus {
  border: 2px solid #43b02a;
}

.input-box input.is-invalid:not(:disabled):hover,
.input-box input:required.is-invalid:not(:disabled):hover,
.input-box input.is-invalid:hover,
.input-box input:required.is-invalid,
.input-box input.is-invalid {
  border: 1px solid #eb5757 !important;
  padding: 20px 21px 0;
}
.input-box input:focus.is-invalid:not(:disabled):hover,
.input-box input:focus:required.is-invalid:not(:disabled):hover,
.input-box input:focus.is-invalid {
  border: 2px solid #eb5757 !important;
  padding: 20px 20px 0;
}

.input-box {
  position: relative;
  height: 56px;
  margin-top: 2rem;
}

.input-box input:focus ~ label,
.input-box input:valid ~ label {
  top: 7px;
  transition: 0.5s;
  font-size: 0.75rem;
}
.input-box input ~ label {
  position: absolute;
  left: 20px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1rem;
  color: #868686;
  transition: 0.5s;
  top: 20px;
  margin: 0;
}
.sms_code,
.back {
  text-align: center;
  padding: 0;
  border-radius: 15px;
  font-size: 1rem;
  line-height: 50px;
  box-sizing: border-box;
  border: 2px solid transparent;
  font-weight: 700;
  white-space: nowrap;
  display: block;
  position: relative;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 54px;
  background-color: transparent;
  display: block;
  margin-top: 1rem;
  width: 100%;
}
.sms_code {
  border: 2px solid #fe7333;
  color: #fe7333;
  background: transparent;
}
.sms_code:hover {
  background-color: #fff1eb;
}
.sms_code:disabled {
  background-color: transparent;
  color: #c3c3c3;
  border: 2px solid #f0f0f0;
  pointer-events: none;
}
.back {
  font-size: 1rem;
  color: #43b02a;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
