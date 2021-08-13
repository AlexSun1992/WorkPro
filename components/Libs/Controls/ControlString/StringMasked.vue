<template>
  <div>
    <the-mask
      v-if="data.mask"
      :mask="data.mask"
      class="form-control"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-bind:value="data.value"
      v-on:input="updateValue($event)"
      @input.native="handler($event)"
      type="text"
      :masked="false"
      :tokens="customTokens"
    ></the-mask>
    <b-form-invalid-feedback :state="isState">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
    <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
    <!--    <p class="error">{{ data.error }}</p>-->
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
export default {
  name: "StringMasked",
  components: { TheMask },
  data() {
    return {
      customTokens: {
        "#": { pattern: /\d/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleUpperCase() },
        R: { pattern: /[а-яА-я]/, transform: (v) => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleLowerCase() },
        "!": { escape: true },
      },
    };
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
  methods: {
    updateValue(val) {
      if (this.data.value !== val) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val,
        });
      }
    },
    handler(val) {
      if (val.data) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: this.data.value,
          realValue: val.data,
        });
      }
    },
  },
  computed: {
    isState() {
      let state = true;
      if (this.data.state === false) {
        state = false;
      }
      if (Boolean(this.data.error)) {
        state = false;
      }
      return state;
    },
  },
};
</script>
