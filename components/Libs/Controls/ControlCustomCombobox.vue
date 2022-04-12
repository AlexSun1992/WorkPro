<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" /><span v-if="data.helpText">
        (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
          <span v-html="data.helpText" /></vue-easy-tooltip
      ></span>
    </template>
    <model-select
      v-model="fieldValue"
      :is-disabled="!edit || data.readonly"
      :class="validClass"
      :options="data.options"
      :placeholder="data.placeholder"
    />
    <b-form-invalid-feedback :state="data.state">
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { ModelSelect } from "vue-search-select";

export default {
  name: "ControlCustomCombobox",
  components: {
    ModelSelect,
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
  computed: {
    fieldValue: {
      get() {
        return this.data.value;
      },
      set(value) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value,
        });
      },
    },
    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
  },
};
</script>
