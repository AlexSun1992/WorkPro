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
    <autocomplete
      ref="autocomplete"
      :placeholder="data.placeholder"
      :class="validClass"
      :auto-select="true"
      :search="search"
      :get-result-value="getResultValue"
      @submit="handleSubmit"
      @blur="handleBlur"
    />
    <b-form-invalid-feedback :state="data.state">
      {{ data.error ? data.error : "Обязательно для заполнения" }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { ModelSelect } from "vue-search-select";

import Autocomplete from "@trevoreyre/autocomplete-vue";
import "@trevoreyre/autocomplete-vue/dist/style.css";

export default {
  name: "ControlCustomCombobox",
  components: {
    ModelSelect,
    Autocomplete,
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
  methods: {
    search(value) {
      if (
        value.length < 1 ||
        this.data.options.find((item) => item.value === this.data?.value)
          ?.text === value
      ) {
        return this.data.options;
      }
      return this.data.options.filter((item) => item.text.includes(value));
    },
    getResultValue(item) {
      return item.text;
    },
    handleSubmit(result) {
      document.activeElement.blur();
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result?.value || null,
      });
    },
    handleBlur() {
      if (Boolean(this.$refs.autocomplete.value) === false) {
        const value = this.data.options.find(
          (item) => item.value === this.data?.value
        );
        if (value) {
          this.$refs.autocomplete.value = value.text;
          this.handleSubmit(value);
        }
      } else {
        const find = this.data.options.find((i) =>
          i.text.includes(this.$refs.autocomplete?.value)
        );
        if (find !== undefined) {
          this.$refs.autocomplete.value = find.text;
          this.handleSubmit(find);
        }
      }
    },
  },
};
</script>
