<template>
  <input
    type="text"
    :value="value"
    :disabled="disabledComputed"
    @input="onInput($event)"
    @blur="$emit('blur')"
    @keydown="$emit('keydown', $event)"
    autocomplete="off"
  />
</template>

<script>
export default {
  props: {
    value: {
      default: null,
    },
    formatter: {
      type: Function,
      default: null,
    },
    disabled: {
      default: false,
    },
  },
  computed: {
    disabledComputed() {
      return this.disabled;
    },
  },
  methods: {
    onInput(value) {
      let _value = value.target.value;

      this.formatter && (_value = this.formatter(_value));

      value.target.value = _value;
      this.$emit("input", _value);
    },
  },
};
</script>

<style scoped>
input[disabled] {
  opacity: 0.6;
}
</style>
