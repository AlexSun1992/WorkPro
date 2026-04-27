<template>
  <div
    id="sms-confirm"
    class="sms-confirm"
  >
    <p
      id="sms-confirm-message"
      class="mt-4"
      v-html="message"
    />
    <!-- Если при первом заходе был PHONE (или DEBUG) — показываем форму -->
    <template v-if="initialLoaded">
      <input
        v-model="code"
        type="text"
        maxlength="6"
        class="sms-confirm__input"
        :class="{ 'sms-confirm__input--error': !!error }"
        :disabled="loadingConfirm || loadingInfo"
        placeholder="Введите код из СМС"
        @input="onCodeInput"
        @keyup.enter="onConfirm"
      />
      <p
        v-if="error"
        id="sms-confirm-error"
        class="sms-confirm__error"
      >
        {{ error }}
      </p>

      <div class="sms-confirm__actions">
        <button
          id="sms-confirm-confirm-btn"
          type="button"
          class="btn btn-primary mt-3 mt-lg-4 w-100"
          @click="onConfirm"
          :disabled="isConfirmDisabled"
        >
          {{ loadingConfirm ? TEXT.CONFIRM_LOADING : TEXT.CONFIRM_DEFAULT }}
        </button>

        <button
          id="sms-confirm-resend-btn"
          type="button"
          class="btn btn-secondary mt-3 mt-lg-4 w-100"
          @click="onResend"
          :disabled="isResendLocked || loadingResend"
        >
          {{ resendButtonText }}
        </button>
      </div>
    </template>
    <p
      v-if="success"
      id="sms-confirm-success"
      class="sms-confirm__success"
    >
      {{ success }}
    </p>
  </div>
</template>

<script>
import axios from "axios";
import { ref, computed, onMounted, onBeforeUnmount, getCurrentInstance } from "vue";

/** ВКЛ/ВЫКЛ debug-режим СМС (без реального API, с мок-JSON) */
const DEBUG_SMS_MODE = false;
// Например, можно так:
// const DEBUG_SMS_MODE = process.env.VUE_APP_SMS_DEBUG === 'true';

/** Единый URL API */
const API_URL = "/am/free/v2/redirectShortLink";

/** Тексты */
const TEXT = {
  DEFAULT_MESSAGE: "Выполняется вход...",
  SESSION_NOT_FOUND: "Сессия подтверждения не найдена. Перейдите по ссылке ещё раз.",
  FETCH_ERROR: "Не удалось получить информацию по СМС. Попробуйте обновить страницу.",

  CONFIRM_DEFAULT: "Подтвердить",
  CONFIRM_LOADING: "Подтверждаем…",
  CONFIRM_SUCCESS: "Код успешно подтверждён.",
  CONFIRM_INVALID: "Неверный код. Проверьте СМС и попробуйте ещё раз.",
  CONFIRM_EXPIRED: "Код больше не активен. Перейдите по новой ссылке или запросите новый код.",
  CONFIRM_GENERIC_ERROR: "Не удалось подтвердить код. Попробуйте позже.",

  RESEND_SENDING: "Отправляем…",
  RESEND_DEFAULT: "Отправить код повторно",
  RESEND_SUCCESS: "Новый код отправлен по СМС.",
  RESEND_TOO_OFTEN: "Код уже отправлен. Повторная отправка будет доступна чуть позже.",
  RESEND_FLOW_CLOSED: "Ссылка или код больше не активны. Перейдите по новой ссылке.",
  RESEND_GENERIC_ERROR: "Не удалось отправить код повторно. Попробуйте позже.",
};

const UI_TEXT = {
  defaultInfo: "Выполняется вход...",
  resendSending: "Отправляем…",
  resendReady: "Отправить код повторно",
  resendLocked: (sec) => `Отправить код повторно (${sec})`,

  // локальные (не от бэка) сообщения
  sessionNotFound: "Сессия подтверждения не найдена. Перейдите по ссылке ещё раз.",
  resendSuccess: "Новый код отправлен по СМС.",
  genericFail: "Что-то пошло не так",
};

/** Имена auth-кук такие же, как в middleware redirectShortLink */
const AUTH_COOKIES = {
  ACCESS: "auth._token.local",
  REFRESH: "auth._refresh_token.local",
};

/** Моки для debug-режима */
const MOCK_SUCCESS_REDIRECT = {
  ACCESS_TOKEN: "kgmqjhtc3xoy5wzxxb9rxzgq54g064lv5llhc3vzz5zcj784vec9tsqqk3qqme79i9gh0uwxh94g6ov1js90wblqob7",
  EXPIRES_IN: 3600,
  TOKEN_TYPE: "Bearer",
  ID: 1321778,
  REFRESH_TOKEN: "yi29iffuj151dogq0hmr4v0qjqtz7logix6fxoy08txe7900eydukbyi8w9p03b2zbhacfr8bk6b50rxo7urwmzruf5",
  REDIRECT_URL: "/cabinet/wizard/744/55/0/745/0/0",
};

const MOCK_SMS_CONFIRM = {
  PHONE: "(***) - *** - ** - 11",
  MESSAGE: "На номер (***) - *** - ** - 11 был выслан код подверждения, пожалуйста введите его в соответсвующее поле.",
  remainingSeconds: 60, // при первом заходе сразу таймер 60 сек
};

/** простое чтение cookies в браузере */
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop().split(";").shift();
  }
  return null;
}

// helper: удалить куку sms_hash во всём домене
function clearSmsHashCookie() {
  try {
    // самый совместимый способ — Max-Age=0 (+ path=/)
    document.cookie = "sms_hash=; Max-Age=0; path=/";
  } catch (e) {
    console.error(e);
  }
}

/** Нормализуем payload (учитываем, что бэк может вернуть массив или объект) */
function getPayload(response) {
  const raw = response?.data;
  if (Array.isArray(raw)) {
    return raw[0] || {};
  }
  return raw || {};
}

/**
 * Устанавливаем auth-токены в cookies (через $cookiz, если есть; иначе напрямую)
 * Ожидаем ACCESS_TOKEN/REFRESH_TOKEN или accessToken/refreshToken.
 */
function setAuthCookiesFromResponse(data, cookiz) {
  if (!data || typeof data !== "object") return;

  const accessToken = data.ACCESS_TOKEN || data.accessToken;
  const refreshToken = data.REFRESH_TOKEN || data.refreshToken;

  if (!accessToken || !refreshToken) return;

  if (cookiz) {
    cookiz.set(AUTH_COOKIES.ACCESS, `Bearer ${accessToken}`);
    cookiz.set(AUTH_COOKIES.REFRESH, refreshToken);
  } else {
    document.cookie = `${AUTH_COOKIES.ACCESS}=Bearer%20${encodeURIComponent(accessToken)};path=/`;
    document.cookie = `${AUTH_COOKIES.REFRESH}=${encodeURIComponent(refreshToken)};path=/`;
  }
}

export default {
  name: "SmsConfirm",

  setup() {
    const message = ref(TEXT.DEFAULT_MESSAGE);
    const code = ref("");

    // hash берем из cookies и ВСЕГДА отправляем в POST
    const hash = ref(getCookie("sms_hash") || "");

    const countdown = ref(60); // 60 секунд блокировки ресенда при первом заходе
    const timerId = ref(null);

    const loadingInfo = ref(false);
    const loadingConfirm = ref(false);
    const loadingResend = ref(false);

    const error = ref("");
    const success = ref("");

    // true = можно показывать форму (input + кнопки)
    const initialLoaded = ref(false);

    // кнопка "Отправить повторно" блокируется таймером
    const isResendLocked = computed(() => countdown.value > 0);

    // кнопка "Подтвердить": минимум 5 цифр и нет загрузки
    const isConfirmDisabled = computed(() => {
      if (loadingConfirm.value || loadingInfo.value) return true;
      return code.value.length < 5;
    });

    // текст кнопки resend
    const resendButtonText = computed(() => {
      if (loadingResend.value) return TEXT.RESEND_SENDING;
      if (isResendLocked.value) return `${TEXT.RESEND_DEFAULT} (${countdown.value})`;
      return TEXT.RESEND_DEFAULT;
    });

    function clearTimer() {
      if (timerId.value) {
        clearInterval(timerId.value);
        timerId.value = null;
      }
    }

    function startCountdown(seconds = 60) {
      clearTimer();
      countdown.value = seconds;

      if (seconds <= 0) return;

      timerId.value = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1;
        }
        if (countdown.value <= 0) {
          clearTimer();
        }
      }, 1000);
    }

    // Чистим всё, кроме цифр, и ограничиваем длину
    function onCodeInput(event) {
      const digits = event.target.value.replace(/\D/g, "");
      code.value = digits.slice(0, 6);
    }

    // доступ к $cookiz (Nuxt)
    const instance = getCurrentInstance();
    const cookiz = instance?.proxy?.$cookiz || null;

    // INFO: первичный запрос
    async function fetchInfo() {
      // DEBUG: не идём на бэк, сразу подставляем мок SMS_CONFIRM
      if (DEBUG_SMS_MODE) {
        const data = MOCK_SMS_CONFIRM;

        message.value = data.MESSAGE || TEXT.DEFAULT_MESSAGE;

        if (data.PHONE) {
          initialLoaded.value = true;
          const seconds = typeof data.remainingSeconds === "number" ? data.remainingSeconds : 60;
          startCountdown(seconds);
        } else {
          initialLoaded.value = false;
        }
        return;
      }
      if (!hash.value) {
        message.value = TEXT.SESSION_NOT_FOUND;
        initialLoaded.value = false;
        return;
      }

      loadingInfo.value = true;
      error.value = "";
      success.value = "";
      initialLoaded.value = false;

      try {
        const resp = await axios.post(API_URL, {
          hash: hash.value,
        });

        const data = getPayload(resp);

        // 1) Если уже пришли токены → сразу авторизуем и редиректим
        if (data.ACCESS_TOKEN || data.REFRESH_TOKEN) {
          setAuthCookiesFromResponse(data, cookiz);
          const redirectUrl = data.REDIRECT_URL || data.redirectUrl || "/";
          clearSmsHashCookie();
          window.location.href = redirectUrl;
          return;
        }

        // 2) Если есть телефон → показываем форму (PHONE + MESSAGE)
        if (data.PHONE) {
          message.value = data.MESSAGE || TEXT.DEFAULT_MESSAGE;

          if (typeof data.remainingSeconds === "number") {
            startCountdown(data.remainingSeconds);
          } else {
            startCountdown(60);
          }

          initialLoaded.value = true; // форма видна
          return;
        }

        // 3) Телефона нет → показываем только сообщение, форму не рендерим
        message.value = data.MESSAGE || TEXT.FETCH_ERROR;
        initialLoaded.value = false;
      } catch (e) {
        const info = e?.response?.data?.INFO;
        message.value = typeof info === "string" && info.trim() ? info.trim() : UI_TEXT.genericFail;
        initialLoaded.value = false;
      } finally {
        loadingInfo.value = false;
      }
    }

    // CONFIRM: отправка кода
    async function onConfirm() {
      if (code.value.length < 5) return;

      loadingConfirm.value = true;
      error.value = "";
      success.value = "";

      try {
        let data;

        if (DEBUG_SMS_MODE) {
          // DEBUG: используем мок SUCCESS_REDIRECT без запросов
          data = MOCK_SUCCESS_REDIRECT;
        } else {
          if (!hash.value) {
            error.value = TEXT.SESSION_NOT_FOUND;
            return;
          }

          const resp = await axios.post(API_URL, {
            hash: hash.value,
            code: code.value,
          });

          data = getPayload(resp);
        }

        setAuthCookiesFromResponse(data, cookiz);

        success.value = TEXT.CONFIRM_SUCCESS;

        initialLoaded.value = false;

        message.value = TEXT.DEFAULT_MESSAGE;

        const redirectUrl = data.REDIRECT_URL || data.redirectUrl || "/";
        clearSmsHashCookie();
        window.location.href = redirectUrl;
      } catch (e) {
        if (DEBUG_SMS_MODE) {
          error.value = TEXT.CONFIRM_GENERIC_ERROR;
          return;
        }
        const info = e?.response?.data?.INFO;
        error.value = typeof info === "string" && info.trim() ? info.trim() : UI_TEXT.genericFail;
      } finally {
        loadingConfirm.value = false;
      }
    }

    // RESEND: запросить новый код
    async function onResend() {
      if (isResendLocked.value) return;

      loadingResend.value = true;
      error.value = "";
      success.value = "";

      try {
        if (DEBUG_SMS_MODE) {
          success.value = TEXT.RESEND_SUCCESS;
          code.value = "";
          startCountdown(60);
          return;
        }

        if (!hash.value) {
          error.value = TEXT.SESSION_NOT_FOUND;
          return;
        }

        const resp = await axios.post(API_URL, {
          hash: hash.value,
          resend: true,
        });

        const data = getPayload(resp);

        success.value = TEXT.RESEND_SUCCESS;
        code.value = "";

        const waitSeconds = typeof data.waitSeconds === "number" ? data.waitSeconds : 60;

        startCountdown(waitSeconds);
      } catch (e) {
        if (DEBUG_SMS_MODE) {
          error.value = TEXT.RESEND_GENERIC_ERROR;
          return;
        }

        const info = e?.response?.data?.INFO;
        error.value = typeof info === "string" && info.trim() ? info.trim() : UI_TEXT.genericFail;
      } finally {
        loadingResend.value = false;
      }
    }

    onMounted(() => {
      fetchInfo();
    });

    onBeforeUnmount(() => {
      clearTimer();
    });

    return {
      TEXT,
      message,
      code,
      countdown,
      loadingInfo,
      loadingConfirm,
      loadingResend,
      error,
      success,
      initialLoaded,
      isResendLocked,
      isConfirmDisabled,
      resendButtonText,
      onCodeInput,
      onConfirm,
      onResend,
      fetchInfo,
    };
  },
};
</script>
<style scoped>
.sms-confirm__input--error {
  border-color: #eb5757;
  border-width: 2px;
}
.sms-confirm__error {
  font-size: 0.9rem;
  color: #eb5757;
}
</style>
