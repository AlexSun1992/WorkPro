<template>
  <div>
    <div
      :id="id"
      ref="captchaContainer"
      :class="{ 'yandex-captcha': !invisible }"
    ></div>
  </div>
</template>

<script>
import {
  loadScript,
  yandexCaptchaResetDecorator,
  // eslint-disable-next-line
} from "@/components/Libs/Controls/ControlYandexCaptcha/controlYandexCaptcha.helper";

export default {
  name: "ControlYandexCaptcha",
  props: {
    data: { type: Object, default: () => ({}) },
    invisible: { default: true, type: Boolean },
  },

  data: () => ({
    widgetId: null,
    captcha: null,
    sitekey: null,
  }),

  computed: {
    id() {
      return `captcha-container-${this.data.fieldId}`;
    },
  },

  created() {
    this.sitekey = process.env.VUE_APP_SMART_CAPTCHA_SITE_KEY1;
    this.addRequestInterceptors();
  },

  mounted() {
    this.mountScript();
  },

  beforeUnmount() {
    window.removeEventListener("load", this.onSmartCaptchaReady);
    this.destroyCaptcha();
  },

  methods: {
    addRequestInterceptors() {
      this.$axios?.interceptors.request.use(
        async (config) => {
          if (this.isNeedCaptcha(config.data)) {
            try {
              const token = await this.getCaptchaToken();
              this.setCaptchaToken(config.data, token);
            } catch (error) {
              console.error(`addRequestInterceptors. ${error}`);

              throw new Error("Ошибка получения капчи");
            }
          }

          return config;
        },
        (err) => Promise.reject(err)
      );
    },

    isNeedCaptcha(data) {
      if (data) {
        if (Array.isArray(data)) {
          return data.some((item) => this.isNeedCaptcha(item));
        }

        if (typeof data === "object") {
          return this.isEmptyCaptcha(data);
        }
      }

      return false;
    },

    isEmptyCaptcha(item) {
      return Object.entries(item).some(
        (data) => data[0].toLowerCase() === "captcha" && (!data[1] || data[1] === this.sitekey)
      );
    },

    getCaptchaToken() {
      return new Promise((resolve, reject) => {
        this.updateCaptcha((token) => {
          if (token) {
            resolve(token);
          } else {
            reject(new Error("Не удалось получить токен капчи"));
          }
        });
      });
    },

    setCaptchaToken(data, token) {
      const name = this.data.name ?? "captcha";
      const setToken = (data) => {
        const key = Object.keys(data).find((key) => key.toLowerCase() === name.toLowerCase());

        if (key) {
          data[key] = token;
        }
      };

      // Установка токена для массива объектов
      if (Array.isArray(data)) {
        data.forEach((item) => {
          if (typeof item === "object") {
            setToken(item);
          }
        });
        return;
      }

      // Установка токена для объекта
      if (typeof data === "object") {
        setToken(data);
      }
    },
    onSmartCaptchaReady() {
      if (!this.captcha) {
        throw new Error("SmartCaptcha is not present");
      }

      if (this.sitekey) {
        this.widgetId = this.captcha.render(this.$refs.captchaContainer, {
          sitekey: this.sitekey,
          callback: this.onCaptchaSuccess,
          errorCallback: this.onCaptchaError,
          hideShield: true,
          invisible: this.invisible,
        });

        this.initSubscribes();
        this.decorateCaptcha();
      }
    },

    executeCaptcha() {
      this.captcha.execute(this.widgetId);
    },

    decorateCaptcha() {
      yandexCaptchaResetDecorator(this.captchaCleared, false);
    },

    initSubscribes() {
      this.captcha.subscribe(this.widgetId, "token-expired", this.captchaCleared);
    },

    captchaCleared(showMessage = true) {
      if (showMessage) {
        console.warn("Истекло время жизник Captcha, нужно обновить.");
      }

      this.updateValue("");
    },

    resetCaptcha() {
      this.captcha.reset(this.widgetId);
    },

    updateCaptcha(callBack) {
      this.customSuccessCallBack = callBack ?? null;

      this.resetCaptcha();
      this.executeCaptcha();
    },

    onCaptchaSuccess(value) {
      if (typeof this.customSuccessCallBack === "function") {
        this.customSuccessCallBack(value);

        this.customSuccessCallBack = null;
      }

      this.updateValue(value);
    },

    onCaptchaError(error) {
      console.error("Yandex SmartCaptcha error:", error);

      this.updateValue("");
    },

    updateValue(value) {
      this.$emit("captcha-updated", value);
      this.$emit("update", {
        fieldId: this.data?.fieldId,
        name: this.data?.name,
        value: value ?? "",
      });
    },

    async mountScript() {
      await loadScript("https://smartcaptcha.cloud.yandex.ru/captcha.js?render=onload");

      if (window.smartCaptcha && this.sitekey) {
        this.captcha = window.smartCaptcha;

        this.onSmartCaptchaReady();
      } else {
        window.addEventListener("load", this.onSmartCaptchaReady);
      }
    },
  },
};
</script>

<style scoped></style>
