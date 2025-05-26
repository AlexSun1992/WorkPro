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
    <b-form-input
      v-model="fieldValue"
      :disabled="!edit ? !edit : data.readonly"
      :type="'number'"
      :state="data.state"
      :min="0"
      oninput="validity.valid||(value='')"
      :id="data.name"
    ></b-form-input>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlDouble",
  components: { BFormGroup },
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
        return this.data.value;
      },
      set: function (value) {
        this.$emit("update", { fieldId: this.data.fieldId, value: value });
      },
    },
  },
};
</script>
