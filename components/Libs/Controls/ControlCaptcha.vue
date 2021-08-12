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
            v-model="captchaValue"
            :disabled="!edit ? !edit : data.readonly"
            :state="data.state"
            autocomplete="off"
            @update="setValue"
          />
          <b-form-invalid-feedback>
            Обязательно для заполнения
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <div class="col-lg-3">
        <b-spinner v-if="isLoading" class="mt-4 ml-4" />
        <img
          v-else
          class="captcha mt-2"
          alt="Капча"
          :src="captcha.CAPTCHA"
          title="Обновить"
        />
        <b-button @click="showCaptcha">Обновить</b-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ControlCaptcha",
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
      captcha: null,
      captchaValue: null,
      isLoading: false,
    };
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal.readonly === false && oldVal.readonly === true) {
        this.showCaptcha();
      }
    },
  },
  created() {
    this.showCaptcha();
  },
  methods: {
    async showCaptcha() {
      this.isLoading = true;
      this.captcha = await this.$store.dispatch("data_card/fetchCaptcha", {
        params: this.$store.getters["data_card/getFormParams"],
        data: this.data,
      });
      if (this.captchaValue !== null) {
        this.captchaValue = null;
        this.setValue();
      }
      this.isLoading = false;
    },
    setValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: value ? this.captcha.ID + "|" + value : null,
      });
    },
  },
};
</script>

<style scoped>
.captcha {
  cursor: pointer;
}
</style>
