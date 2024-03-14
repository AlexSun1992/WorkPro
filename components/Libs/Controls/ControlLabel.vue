<template>
  <b-form-group :label="data.label" :label-for="data.name" class="mb-3">
    <template #label>
      <span v-html="data.label" />
      <span v-if="data.helpText" class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>
    <div v-html="data.value" />
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";

export default {
  name: "ControlLabel",
  components: { BFormGroup },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
};
</script>

<style scoped></style>
