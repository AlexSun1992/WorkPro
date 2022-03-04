<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template v-slot:label
      ><span v-html="data.label"></span
      ><span v-if="data.helpText">
        (?)<vue-easy-tooltip with-arrow="true" position="top" offset="4">
          <span v-html="data.helpText"></span></vue-easy-tooltip></span
    ></template>
    <model-select
      v-model="fieldValue"
      :is-disabled="!edit || data.readonly"
      :class="validClass"
      :options="data.options"
      :placeholder="data.placeholder"
      ref="sign"
    >
    </model-select>
    <b-form-invalid-feedback :state="data.state"
      >{{ data.error ? data.error : "Обязательно для заполнения" }}
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

  methods: {
    eventHandlerBlur() {
      this.$emit("blur", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value,
      });
    },
  },
  computed: {
    fieldValue: {
      get: function () {
        return this.data.value;
      },
      set: function (value) {
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
      } else {
        return "";
      }
    },
  },
};
</script>
