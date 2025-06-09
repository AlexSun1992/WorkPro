<template>
  <div>
    <the-mask
      v-if="data.mask"
      :mask="data.mask"
      class="form-control"
      :class="validClass"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      :value="dataValue"
      type="text"
      :masked="isMask"
      :tokens="customTokens"
      @input="updateValue($event)"
      @input.native="eventHandlerInputNative($event.target.value)"
      @blur.native="eventHandlerBlur($event)"
    />
    <b-form-invalid-feedback :state="isState">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";

export default {
  name: "StringMasked",
  components: { TheMask },
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
      customTokens: {
        "#": { pattern: /\d/ },
        Y: {
          pattern: /^[a-zA-Za-яА-ЯёЁ0-9]+$/,
        },
        N: { pattern: /[0-9]/ },
        X: { pattern: /[0-9a-zA-Z]/ },
        S: { pattern: /[a-zA-Z]/ },
        A: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleUpperCase() },
        R: { pattern: /[а-яА-ЯёЁ]/, transform: (v) => v.toLocaleUpperCase() },
        a: { pattern: /[a-zA-Z]/, transform: (v) => v.toLocaleLowerCase() },
        "!": { escape: true },
      },
    };
  },

  computed: {
    isMask() {
      return this.data.isMask || false;
    },
    isState() {
      let state = null;

      if (this.data.state === false) {
        state = false;
      }
      if (this.data.error) {
        if (this.data.error !== null) {
          state = false;
        }
      }
      if (this.data.state) {
        state = !this.data.error;
      }

      return state;
    },
    validClass() {
      if (this.isState !== null) {
        return this.isState === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
    dataValue() {
      return this.data.value;
    },
  },

  methods: {
    updateValue(val) {
      if (this.data.value !== val) {
        if (val !== null && val !== undefined) {
          this.$emit("update", {
            fieldId: this.data.fieldId,
            name: this.data.name,
            value: val,
          });
        }
      }
    },
    eventHandlerBlur(e) {
      this.$emit("blur", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
    eventHandlerInputNative(val) {
      if (this.dataValue === undefined || this.dataValue === null) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: val,
        });
      }
    },
  },
};
</script>
