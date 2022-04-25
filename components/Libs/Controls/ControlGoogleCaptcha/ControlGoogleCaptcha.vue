<template>
  <vue-recaptcha
    ref="recaptcha"
    size="invisible"
    :sitekey="siteKey"
    :load-recaptcha-script="true"
    @verify="setToken"
    @expired="onCaptchaExpired"
  >
    <button @click="onEvent">Click me123</button>
  </vue-recaptcha>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";

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
      load: false,
    };
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
