<template>
  <div>
    <div class="row">
      <div class="col-md-6">
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
      <div class="col-md-6 pt-3">
        <b-spinner v-if="isLoading" class="ml-4" />
        <img
          v-else
          class="captcha"
          alt="Капча"
          :src="captcha.CAPTCHA"
          title="Обновить"
        />
        <b-button
          @click="showCaptcha"
          class="reload-captcha"
          variant="outline-success"
          >Обновить</b-button
        >
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
    if (this.data.captcha === null) {
      this.showCaptcha();
    } else {
      this.captcha = this.data.captcha;
    }
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
