<template>
  <div
    id="captcha-form"
    class="row"
  >
    <div class="col-lg-4">
      <form-group
        label="Введите код с картинки"
        label-cols="12"
      >
        <b-form-input
          id="captcha-code"
          v-model="code"
          @update="updateEnterCode($event)"
          placeholder="Введите код с картинки"
          type="text"
          :state="isValidStateCodeCaptcha"
          class="form-control"
          :disabled="isLoading"
        ></b-form-input>
        <div
          class="invalid-feedback"
          v-if="isValidStateCodeCaptcha === false"
        >
          {{ isCaptchaValid }}
          <!-- Пожалуйста, заполните это поле -->
        </div>
      </form-group>
    </div>
    <div class="col-lg-8 blk-img-captcha">
      <div class="row align-items-end">
        <div class="col-12 col-lg-6">
          <span v-if="isLoading">Загрузка...</span>
          <img
            v-else
            class="captcha"
            alt="Капча"
            :src="captcha"
            title="Обновить"
          />
        </div>
        <div class="col-12 col-lg-6">
          <button
            type="button"
            @click="refreshDisplayCaptcha"
            :disabled="isLoading"
            class="btn btn-gray reload-captcha"
          >
            Обновить
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BFormInput } from "bootstrap-vue";
import axios from "axios";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export default {
  name: "Captcha",
  components: {
    FormGroup,
    BFormInput,
  },
  props: {
    isCaptchaValid: {
      type: String,
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
  created() {
    this.refreshDisplayCaptcha();
  },
  methods: {
    async refreshDisplayCaptcha() {
      this.isLoading = true;
      const dataCaptcha = await axios.get("/lk/authw/v2/captcha");
      this.captcha = dataCaptcha.data?.CAPTCHA;
      this.id = dataCaptcha.data?.ID;
      this.$emit("update", this.id);
      this.isLoading = false;
    },
    updateEnterCode(code) {
      this.$emit("updateCode", code);
    },
  },
};
</script>

<style scoped></style>
