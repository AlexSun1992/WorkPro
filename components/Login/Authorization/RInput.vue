<template>
  <div>
    <div
      :id="id"
      :class="classesList"
    >
      <label
        v-if="label"
        :for="name"
      >
        {{ label }}
      </label>
      <input
        :id="name"
        v-maska="mask"
        :value="value"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        class="r-input"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </div>

    <div
      v-if="infoText"
      class="r-input-info"
    >
      {{ infoText }}
    </div>
    <div
      v-if="errorInputText && state === false"
      class="invalid-feedback"
    >
      {{ errorInputText }}
    </div>
  </div>
</template>

<script>
import { computed, ref } from "vue";

export default {
  name: "RInput",

  props: {
    value: {
      type: [String, Number],
      default: "",
    },
    mask: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    errorInputText: {
      type: String,
      default: "",
    },
    state: {
      type: [Boolean, null],
      default: null,
    },
    infoText: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "text",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
  },

  emits: ["focus", "blur", "change", "input"],

  setup(props, { emit }) {
    const isFocused = ref(false);

    const isError = computed(() => {
      if (props.state === null && !props.errorInputText) return false;
      return Boolean(props.errorInputText) && props.state === false;
    });

    const hasValue = computed(() => props.value !== null && props.value !== "" && String(props.value).length > 0);
    const showPlaceholder = computed(() => !isFocused.value && !hasValue.value);

    const classesList = computed(() => [
      "input-box",
      isFocused.value && "r-focused",
      isError.value && "r-error",
      hasValue.value && "r-filled",
      showPlaceholder.value && props.placeholder && "r-placeholder",
      props.disabled && "r-disabled",
      props.readonly && "r-readonly",
    ]);

    const handleInput = (event) => {
      emit("input", event.target.value);
    };

    const handleFocus = (event) => {
      isFocused.value = true;
      emit("focus", event.target.value);
    };

    const handleBlur = (event) => {
      isFocused.value = false;
      emit("blur", event.target.value);
    };

    return {
      classesList,
      handleInput,
      handleFocus,
      handleBlur,
    };
  },
};
</script>

<style scoped>
.input-box {
  height: 56px;
  background-color: #f2f4f5;
  border-radius: 16px !important;
  border: 2px solid #f2f4f5;
  padding: 0;
  transition: 0.3s;
}
.input-box input:hover,
.input-box input:focus {
  border: 0;
}
.input-box input {
  padding: 16px 20px 0 20px;
  margin: 0;
  color: #292929;
  caret-color: #43b02a;
  border: 0;
  background-color: transparent;
  max-height: 52px;
  border-radius: 16px !important;
}
.input-box label + input {
  padding: 24px 20px 0 20px;
}

.input-box:hover,
.input-box.r-focused {
  border: 2px solid #43b02a;
}

.input-box.r-error:not(:disabled):hover,
.input-box.r-error:hover,
.input-box.r-error.r-focused {
  border: 2px solid #eb5757 !important;
}
.input-box.r-error.r-focused {
  background-color: #f2f4f5;
}
.input-box.r-error {
  background-color: #ff000020;
}
.input-box input::placeholder {
  color: #a4a4a4;
}
.input-box {
  position: relative;
  height: 56px;
}
.input-box label {
  position: absolute;
  left: 20px;
  font-weight: 400;
  font-size: 1rem;
  line-height: 1rem;
  color: #868686;
  transition: 0.5s;
  top: 20px;
  margin: 0;
  cursor: pointer;
}
.input-box.r-placeholder label,
.input-box.r-focused label,
.input-box.r-filled label {
  top: 7px;
  transition: 0.5s;
  font-size: 0.75rem;
}
.invalid-feedback,
.r-error-text {
  font-size: 0.875rem;
  color: #eb5757;
  padding-right: 1rem;
  display: block;
  margin-left: 20px;
  margin-top: 4px;
}
.r-input-info {
  font-size: 0.875rem;
  color: #868686;
  margin-left: 20px;
  margin-top: 4px;
}

input:-webkit-autofill:focus,
input:-webkit-autofill,
input:-webkit-autofill:hover {
  -webkit-text-fill-color: #292929;
  -webkit-box-shadow: 0 0 0px 40rem #f2f4f5 inset;
}

.input-box.r-error input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 40rem #ff000020 inset;
}
.input-box.r-error input:-webkit-autofill {
  -webkit-box-shadow: 0 0 0px 40rem #f2f4f5 inset;
}
</style>
