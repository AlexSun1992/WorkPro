<template>
  <div>
    <div class="row">
      <div class="col-lg-6">
        <b-form-group
          :label="data.label"
          :class="{ required: data.required }"
          :label-for="data.name"
        >
          <b-form-input
            v-model="captchaDisplayValue"
            :disabled="!edit || data.readonly"
            :state="data.state"
            autocomplete="off"
          />
          <div
            class="invalid-feedback"
            v-if="data.state === false"
          >
            Обязательно для заполнения
          </div>
        </b-form-group>
      </div>
      <div class="col-lg-6 pt-lg-3 text-nowrap">
        <span
          v-if="isLoading"
          class="spinner-border ml-4"
        >
          <span class="sr-only"></span>
        </span>
        <img
          v-else
          class="captcha"
          alt="Капча"
          :src="captchaData.CAPTCHA"
          title="Обновить"
        />
        <button
          @click="refreshDisplayCaptcha"
          class="btn btn-outline-success reload-captcha"
          type="button"
        >
          Обновить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlCaptcha",
  components: {
    BFormGroup,
  },
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
      isLoading: false,
    };
  },
  methods: {
    async refreshDisplayCaptcha() {
      this.isLoading = true;
      await this.$store.dispatch("data_card/fetchCaptcha", {
        params: this.$store.getters["data_card/getFormParams"],
        data: this.data,
      });
      this.isLoading = false;
    },
  },
  computed: {
    captchaData() {
      return this.data?.captcha || {};
    },
    captchaDisplayValue: {
      get() {
        return this.data.value ? this.data.value.split("|")[1] : null;
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          value: value ? `${this.captchaData.ID}|${value}` : null,
        });
      },
    },
  },
};
</script>

<style scoped>
.captcha {
  cursor: pointer;
  height: 37px;
}
.btn-outline-success.reload-captcha {
  padding-left: 32px;
  background: url(/img/reload-captcha.svg) 8px 50% no-repeat;
  height: 37px;
  background-size: 20px;
  margin-left: 15px;
}
</style>
