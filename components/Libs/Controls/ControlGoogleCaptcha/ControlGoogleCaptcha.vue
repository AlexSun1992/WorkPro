<template>
  <div>
    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="data.value"
      @verify="setToken"
      @expired="onCaptchaExpired"
    />
    <b-form-input v-if="false" v-model="fieldValue"></b-form-input>
  </div>
</template>

<script>
import { VueRecaptcha } from "vue-recaptcha";
import { isCaptchaBecomesHide } from "./captchaHelper";

export default {
  name: "ControlGoogleCaptcha",
  components: { VueRecaptcha },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      token: null,
      captchaHired: false,
    };
  },

  mounted() {
    let externalScript = document.createElement("script");
    externalScript.setAttribute(
      "src",
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    );
    document.head.appendChild(externalScript);
  },

  async updated() {
    await isCaptchaBecomesHide();
    const visibleCaptchas = Array.from(document.querySelectorAll("body>div"))
      .filter((elem) => elem.querySelector("iframe[title*='reCAPTCHA']"))
      .filter((item) => item.style.visibility === "visible");

    if (visibleCaptchas.length === 0) {
      this.captchaHired = true;
    } else {
      this.captchaHired = false;
    }
  },

  methods: {
    setToken(token) {
      this.token = token;
      this.$store.commit("data_card/setRecaptchaToken", this.token);
    },
    recaptchaExecute() {
      this.$refs.recaptcha.execute();
    },
    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value,
        });
      },
    },

    getData() {
      return this.data;
    },

    saveButtonClicked() {
      return this.$store.getters["data_card/saveButtonClicked"];
    },
    saveButtonClickedAmount() {
      return this.$store.getters["data_card/saveButtonClickedAmount"];
    },
  },

  watch: {
    async saveButtonClicked(value) {
      if (!this.$store.getters["data_card/saveButtonClicked"]) return;
      this.$refs.recaptcha.reset();
      await this.recaptchaExecute();
    },
    saveButtonClickedAmount(value) {
      if (value !== null && this.captchaHired === true) {
        this.$refs.recaptcha.execute();
      }
      if (value) {
        this.$refs.recaptcha.execute();
      }
    },
    token() {
      this.fieldValue = this.token;

      let updateValueFunction =
        this.$store.getters["data_card/getUpdateValueFunction"];
      let event = this.$store.getters["data_card/getUpdateEvent"];

      updateValueFunction(event);
    },
  },
};
</script>

<style scoped></style>
