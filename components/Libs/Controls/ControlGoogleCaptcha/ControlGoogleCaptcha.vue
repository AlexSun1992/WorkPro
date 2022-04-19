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

    saveButtonClicked() {
      return this.$store.getters["data_card/saveButtonClicked"];
    },
    saveButtonClickedAmount() {
      return this.$store.getters["data_card/saveButtonClickedAmount"];
    },
  },

  watch: {
    async saveButtonClicked() {
      if (!this.$store.getters["data_card/saveButtonClicked"]) return;
      this.$refs?.recaptcha?.reset();
      await this.recaptchaExecute();
    },
    saveButtonClickedAmount(value) {
      if (value !== null && this.captchaHired === true) {
        this.$refs?.recaptcha?.execute();
      }
    },
    token() {
      this.fieldValue = this.token;
      const updateValueFunction =
        this.$store.getters["data_card/getUpdateValueFunction"];
      const event = this.$store.getters["data_card/getUpdateEvent"];

      updateValueFunction(event);
    },
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
};
</script>

<style scoped></style>
