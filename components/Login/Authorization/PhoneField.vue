<template>
  <div>
    <RInput
      mask="+7 (###) ###-##-##"
      label="Мобильный телефон"
      type="text"
      name="authphone"
      v-model="localValue"
      :state="state"
      :errorInputText="errorInputText"
      data-testid="authPhoneEmail"
      @input="handleInput"
      @blur="handleBlur"
    />
  </div>
</template>

<script>
import { ref, watch } from "vue";
import RInput from "./RInput";

export default {
  name: "PhoneField",
  components: { RInput },
  props: {
    validClass: {
      type: [Boolean, null],
      default: null,
    },
    userData: {
      type: Object,
      default: () => ({}),
    },
    errorInputText: {
      type: String,
      default: "",
    },
    state: {
      type: [Boolean, null],
      default: null,
    },
  },
  emit: ["updatePhone"],
  setup(props, { emit }) {
    const localValue = ref("");
    watch(
      () => props.userData?.username,
      (newValue) => {
        if (newValue) {
          localValue.value = newValue;
        }
      },
      { immediate: true }
    );

    const handleInput = (event) => {
      emit("updatePhone", event);
    };
    const handleBlur = (event) => {
      emit("blur", event);
    };
    return {
      localValue,
      handleInput,
      handleBlur,
    };
  },
};
</script>
