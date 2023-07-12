<template>
  <div :label="data.label">
    <span v-if="data.helpText" class="tooltipster">
      (?)<vue-easy-tooltip :with-arrow="true" position="top" :offset="4">
        <span v-html="data.helpText" /></vue-easy-tooltip
    ></span>
    <p>{{ data.label }}:{{ value }}</p>

    <b-form-input
      id="inp"
      v-model="value"
      type="range"
      min="100000"
      max="3000000"
      @input="handleValue(value)"
    ></b-form-input>
  </div>
</template>
<script>
export default {
  name: "ControlRange",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      value: "100000",
    };
  },
  methods: {
    handleValue(result) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result,
      });
    },
  },
};
</script>

<style scoped>
#inp {
  padding: 0;
}
</style>
