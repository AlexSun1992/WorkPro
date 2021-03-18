<template>
  <the-mask
    v-if="data.mask"
    :mask="data.mask"
    v-bind:value="data.value"
    v-on:input="updateValue($event)"
    type="text"
    :masked="false"
  ></the-mask>
</template>

<script>
export default {
  name: "StringMasked",
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  methods: {
    updateValue(val) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: val,
      });
    },
  },
};
</script>
