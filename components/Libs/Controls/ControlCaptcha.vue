<template>
  <div>
    <div v-if="captcha" class="row">
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
        <img
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
      captchaValue: null,
    };
  },
  created() {
    this.showCaptcha();
  },
  methods: {
    async showCaptcha() {
      await this.$store.dispatch("data_card/fetchCaptcha", {
        params: this.$route.params,
        data: this.data,
      });
    },
    setValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: value ? this.captcha.ID + "|" + value : null,
      });
    },
  },
  computed: {
    captcha() {
      return this.data.captcha;
    },
  },
  watch: {
    data(newVal, oldVal) {
      if (newVal.readonly === false && oldVal.readonly === true) {
        this.captchaValue = null;
        this.setValue(null);
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
