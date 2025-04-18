<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label
      ><span v-html="data.label"></span>
      <span v-if="data.helpText" class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText"></span></vue-easy-tooltip></span></span
    ></template>
    <currency-input
      class="form-control"
      :class="validClass"
      :placeholder="placeholder"
      :disabled="!edit ? !edit : data.readonly"
      v-model="fieldValue"
      :allowNegative="false"
      :currency="{ suffix: ` ${placeholder}` }"
      v-on:blur="eventHandlerBlur"
      :id="data.name"
    />

    <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
    <b-form-invalid-feedback :state="data.state">{{
      data.error ? data.error : "Обязательно для заполнения"
    }}</b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { CurrencyInput } from "vue-currency-input";
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlCustomDouble",
  components: { CurrencyInput, BFormGroup },
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
    eventHandlerBlur() {
      this.$emit("blur", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.data.value,
      });
    },
  },

  computed: {
    placeholder() {
      return this.data.placeholder || "";
    },
    fieldValue: {
      get: function () {
        if (this.data.value !== 0) {
          return this.data.value;
        }
      },
      set: function (value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: value !== null ? Number(value) : null,
        });
      },
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      } else {
        return "";
      }
    },
  },
};
</script>

<style scoped></style>
