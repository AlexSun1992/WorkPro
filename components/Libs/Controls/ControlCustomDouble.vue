<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label><span v-html="data.label"></span></template>
    <currency-input
      :placeholder="data.placeholder"
      v-model="fieldValue"
      :allowNegative="false"
      :currency="{ suffix: ` ${data.placeholder}` }"
    />

    <p v-if="data.helpText" class="help-text">{{ data.helpText }}</p>
    <p v-if="data.dangerText" class="danger-text">{{ data.dangerText }}</p>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { CurrencyInput } from "vue-currency-input";

export default {
  name: "ControlCustomDouble",
  components: { CurrencyInput },
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

  computed: {
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
          value: Number(value),
        });
      },
    },
  },
};
</script>
