<template>
  <input
    v-bind="attrs"
    :value="currentValue"
    @input="onInput"
    @change="onChange"
  />
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    value: {
      type: [String, Number],
      default: "",
    },

    modelValue: {
      type: [String, Number],
      default: "",
    },
    formatter: {
      type: Function,
      default: (txt) => txt,
    },
  },

  setup(props, { emit, attrs }) {
    const currentValue = computed(() => (props.modelValue !== undefined ? props.modelValue : props.value));

    function format(value) {
      return props.formatter ? props.formatter(value) : value;
    }

    function onInput(e) {
      let { value } = e.target;

      if (props.formatter) {
        value = format(value);
      }

      emit("update:modelValue", value);
      emit("input", value);

      emit("update", value);
    }

    function onChange(e) {
      let { value } = e.target;

      if (props.formatter) {
        value = format(value);
      }

      emit("update:modelValue", value);
      emit("change", value);
      emit("update", value);
    }

    return {
      props,
      attrs,
      currentValue,
      onInput,
      onChange,
    };
  },
};
</script>
