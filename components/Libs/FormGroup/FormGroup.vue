<template>
  <div
    class="form-group"
    role="group"
  >
    <component
      :is="chooseComponent"
      :for="labelFor"
    >
      <slot name="label">
        {{ label }}
      </slot>
    </component>

    <slot name="default" />
  </div>
</template>

<script>
import { computed, defineComponent } from "vue";

export default defineComponent({
  name: "FormGroup",
  props: {
    label: {
      type: String,
      default: "",
    },
    labelFor: {
      type: String,
      default: "",
    },
  },
  setup(props) {
    const chooseComponent = computed(() => (props.label ? "label" : "fieldset"));

    return {
      chooseComponent,
    };
  },
});
</script>
