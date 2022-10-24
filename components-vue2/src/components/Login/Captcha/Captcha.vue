<template>
  <div class="row">
    <div class="col-lg-6 pt-lg-3 text-nowrap">
      <b-form-group label="Введите код с картинки" label-cols="12">
        <b-form-input
          v-model="code"
          @update="updateEnterCode($event)"
          placeholder="Введите код с картинки"
          type="text"
          :state="isValidStateCodeCaptcha"
          class="form-control"
          :disabled="isLoading"
        ></b-form-input>
        <b-form-invalid-feedback>
          {{ isCaptchaValid }}
          <!-- Пожалуйста, заполните это поле -->
        </b-form-invalid-feedback>
      </b-form-group>
    </div>
    <div class="col-lg-6 pt-lg-3 mt-4 text-nowrap">
      <span v-if="isLoading">Загрузка...</span>
      <img v-else class="captcha" alt="Капча" :src="captcha" title="Обновить" />
      <b-button
        @click="refreshDisplayCaptcha"
        :disabled="isLoading"
        class="reload-captcha"
        variant="primary"
        >Обновить</b-button
      >
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "Captcha",
  props: {
    isCaptchaValid: {
      type: String,
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      code: null,
      captcha: null,
      captchaId: null,
      loadingVisible: false,
      isLoading: false,
    };
  },
  created() {
    this.refreshDisplayCaptcha();
  },
  methods: {
    async refreshDisplayCaptcha() {
      this.isLoading = true;
      const dataCaptcha = await axios.get("/am/authw/v2/captcha");
      this.captcha = dataCaptcha.data?.CAPTCHA;
      this.id = dataCaptcha.data?.ID;
      this.$emit("update", this.id);
      this.isLoading = false;
    },
    updateEnterCode(code) {
      this.$emit("updateCode", code);
    },
  },
  computed: {
    isValidStateCodeCaptcha() {
      if (this.isCaptchaValid && this.code === null) {
        return false;
      }
      if (this.code != null && this.code !== "") {
        return true;
      }
      if (this.code === "") {
        return false;
      }
      return null;
    },
  },
};
</script>

<style scoped></style>
