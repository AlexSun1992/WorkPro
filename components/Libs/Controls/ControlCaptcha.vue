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
        <img class="mt-2" @click="showCaptcha" alt="Капча" :src="captcha" />
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/urls";
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
      captchaId: null,
      captchaValue: null,
    };
  },
  created() {
    this.showCaptcha();
  },
  methods: {
    showCaptcha() {
      this.$axios({
        url: `${api?.CAPTCHA}?project=${this.$route.params.idModule}/${this.$route.params.idItem}&id=${this.$route.params.idCard}`,
        method: "GET",
      })
        .then((resp) => {
          this.captcha = resp.data?.CAPTCHA;
          this.captchaId = resp.data?.ID;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setValue(value) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        value: value ? this.captchaId + "|" + value : null,
      });
    },
  },
};
</script>

<style scoped>
.captcha {
  cursor: pointer;
  margin-top: 25px;
}
</style>
