<template>
  <div>
    <the-mask
      v-b-tooltip.hover.top="data.helpText"
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
    <!-- привязал b-form-invalid-feedback к data.error вместо isState  -->
    <b-form-invalid-feedback :state="data.error"
      >{{ data.error ? data.error : "Обязательно для заполнения" }}
      <p>data.error:{{ data.error }}</p>
      <p>isState:{{ isState }}</p>
    </b-form-invalid-feedback>
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

  computed: {
    isState() {
      let state = null;

      if (this.data.state === false) {
        console.log("!!!");
        state = false;
      }
      if (Boolean(this.data.error)) {
        console.log("!!!");
        if (this.data.error !== null) {
          console.log("!!!");
          state = false;
        }
      }
      if (this.data.state) {
        console.log("!!!");
        state = !Boolean(this.data.error);
      }
      console.log(state);
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
