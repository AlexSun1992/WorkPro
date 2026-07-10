<template>
  <div>
    <the-mask
      v-if="data.mask && !isEmail"
      :mask="data.mask"
      :class="['form-control', validClass]"
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
    <form-input
      v-if="isEmail"
      :class="['form-control', validClass]"
      :placeholder="data.placeholder"
      :disabled="!edit ? !edit : data.readonly"
      :value="dataValue"
      type="text"
      @input="updateValue($event)"
      @input.native="eventHandlerInputNative($event.target.value)"
      @blur.native="eventHandlerBlur($event)"
    />

    <div
      v-if="isState === false"
      class="invalid-feedback"
    >
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </div>
  </div>
</template>

<script>
import { TheMask } from "vue-the-mask";
import FormInput from "@/components/Libs/FormInput/FormInput";

export default {
  name: "StringMasked",
  components: { FormInput, TheMask },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: false,
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
    isEmail() {
      return this.data.mask === "EMAIL";
    },
    isMask() {
      return this.data.isMask || false;
    },
    isState() {
      let state = null;

      if (this.data.state === false) {
        state = false;
      }
      if (this.data.error) {
        state = false;
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
            action: "changed",
          });
        }
      }
    },
    eventHandlerBlur() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
        action: "blur",
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
