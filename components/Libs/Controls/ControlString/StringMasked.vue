<template>
  <div>
    <the-mask
      v-if="data.mask"
      :mask="data.mask"
      class="form-control"
      :class="validClass"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-bind:value="dataValue"
      @input="updateValue($event)"
      @input.native="eventHandlerInputNative($event.target.value)"
      @blur.native="eventHandlerBlur($event)"
      type="text"
      :masked="false"
      :tokens="customTokens"
    ></the-mask>
    <b-form-invalid-feedback :state="isState">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
    <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
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
        N: { pattern: /[0-9]/ },
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
  computed: {
    isState() {
      let state = null;
      if (this.data.state === false) {
        state = false;
      }
      if (Boolean(this.data.error)) {
        if (this.data.error !== null) {
          state = false;
        }
      }
      if (this.data.state) {
        state = !Boolean(this.data.error);
      }
      return state;
    },
    validClass() {
      if (this.isState !== null) {
        return this.isState === true ? "is-valid" : "is-invalid";
      } else {
        return "";
      }
    },
    dataValue() {
      return this.data.value;
    },
  },
};
</script>
