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
            @update="setValue"
            :state="data.state"
            autocomplete="off"
          />
          <b-form-invalid-feedback>
            Обязательно для заполнения
          </b-form-invalid-feedback>
        </b-form-group>
      </div>
      <div class="col-lg-3">
        <b-spinner v-if="isLoading" class="mt-4 ml-4"></b-spinner>
        <img
          v-else
          class="captcha mt-2"
          @click="showCaptcha"
          alt="Капча"
          :src="captcha.CAPTCHA"
          title="Обновить"
        />
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
  created() {
    this.showCaptcha();
  },
  methods: {
    async showCaptcha() {
      this.isLoading = true;
      this.captcha = await this.$store.dispatch("data_card/fetchCaptcha", {
        params: this.$route.params,
        data: this.data,
      });
      this.isLoading = false;
    },
    setValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: value ? this.captcha.ID + "|" + value : null,
      });
    },
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal.readonly === false && oldVal.readonly === true) {
        this.showCaptcha();
      }
    },
  },
};
</script>

<style scoped>
.captcha {
  cursor: pointer;
}
</style>
