<template>
  <vue-recaptcha
    ref="recaptcha"
    size="invisible"
    :sitekey="siteKey"
    @verify="setToken"
    @expired="onCaptchaExpired"
  >
    <button @click="onEvent">Click me</button>
  </vue-recaptcha>
</template>

<script>
import { VueRecaptcha } from "vue-recaptcha";

export default {
  components: { VueRecaptcha },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  data() {
    return {
      siteKey: "6LcR59kUAAAAAN9gdxm2TWPCTey73RTAKGIOkTTV",
    };
  },
  mounted() {
    const externalScript = document.createElement("script");
    externalScript.setAttribute(
      "src",
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit"
    );
    document.head.appendChild(externalScript);
  },
  methods: {
    onEvent() {
      this.$refs.recaptcha.execute();
    },
    setToken(recaptcha) {
      this.token = recaptcha;
    },
    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },
  },
};
</script>

<style scoped></style>
