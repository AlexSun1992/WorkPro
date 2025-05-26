<template>
  <div>
    <vue-recaptcha
      ref="recaptcha"
      size="invisible"
      :sitekey="data.value"
      :load-recaptcha-script="true"
      @verify="setToken"
      @expired="onCaptchaExpired"
    />

    <b-form-input
      v-if="false"
      v-model="fieldValue"
    />
  </div>
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import { waitCaptchaHide } from "./captchaHelper";

function debug(message = "") {
  console.info(new Date().toISOString(), "ControlGoogleCaptcha", message);
}

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
  emits: ["update"],
  data() {
    return {
      waitCaptcha: Promise.resolve(),
      resolveCaptcha: () => {},
    };
  },

  computed: {
    token: {
      get() {
        return this.data.value;
      },
      set(value) {
        debug(`new token ${value.substring(1, 5)}...`);
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
        this.resolveCaptcha();
        this.$refs.recaptcha.reset();
      },
    },
  },

  mounted() {
    debug("mounted");
    this.$store.commit("data_card/addBeforeSavePromise", this.beforeSaveFunction);
  },

  // eslint-disable-next-line vue/no-deprecated-destroyed-lifecycle
  destroyed() {
    debug("unmounted");
    this.$store.commit("data_card/deleteBeforeSavePromise", this.beforeSaveFunction);
  },

  methods: {
    async beforeSaveFunction() {
      debug("beforeSaveFunction");
      this.recaptchaExecute();
      await this.waitCaptcha;
    },

    setToken(token) {
      this.token = token;
    },

    recaptchaExecute() {
      this.waitCaptcha = new Promise((resolve, reject) => {
        this.resolveCaptcha = resolve;
        waitCaptchaHide().then(() => {
          reject(new Error("Для продолжения заполните капчу"));
        });
      });
      this.$refs.recaptcha.execute();
    },

    onCaptchaExpired() {
      this.$refs.recaptcha.reset();
    },
  },
};
</script>

<style scoped></style>
