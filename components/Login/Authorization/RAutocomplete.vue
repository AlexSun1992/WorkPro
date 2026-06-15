<template>
  <div :class="mainClass">
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

      <autocomplete
        :id="name"
        :ref="inputRef"
        :placeholder="placeholder"
        :search="search"
        :get-result-value="getResultValue"
        :disabled="disabled"
        :data-testid="dataTestId"
        @blur="handleBlur"
        @input="handleInput"
        @focus="handleFocus"
      />
    </div>

    <div
      v-if="infoText"
      class="r-input-info"
    >
      {{ infoText }}
    </div>
    <div
      v-if="state === false && errorInputText"
      class="invalid-feedback"
    >
      {{ errorInputText }}
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import Autocomplete from "@trevoreyre/autocomplete-vue";

export default {
  name: "RAutocomplete",
  components: { Autocomplete },
  props: {
    state: { type: [Boolean, null], default: null },
    mainClass: {
      type: String,
      default: "",
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    inputRef: {
      type: String,
      required: true,
    },

    label: {
      type: String,
      default: "",
    },
    search: {
      type: Function,
      required: true,
    },
    getResultValue: {
      type: Function,
      required: true,
    },
    infoText: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    autocompleteClass: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    dataTestId: {
      type: String,
      default: "",
    },
    initialValue: {
      type: String,
      default: "",
    },
    fieldType: {
      type: String,
      required: true,
      validator: (value) => ["surname", "name", "patronymic"].includes(value),
    },
    gender: {
      type: String,
      default: "UNKNOWN",
    },
    suggestionsHub: {
      type: Array,
      default: () => [],
    },
    isGenderRevealed: {
      type: Boolean,
      default: false,
    },
    isGenderDefine: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number],
      default: "",
    },
    errorInputText: {
      type: String,
      default: "",
    },
    readonly: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["blur", "submit", "update:value", "update:state"],
  setup(props, { emit }) {
    const isFocused = ref(false);
    const showPlaceholder = computed(() => !isFocused.value && !hasValue.value);

    const isError = computed(() => {
      if (props.state === null && !props.errorInputText) return false;
      return Boolean(props.errorInputText) && props.state === false;
    });
    const hasValue = computed(() => props.value !== null && props.value !== "" && String(props.value).length > 0);
    const classesList = computed(() => [
      "input-box",
      isFocused.value && "r-focused",
      isError.value && "r-error",
      hasValue.value && "r-filled",
      showPlaceholder.value && props.placeholder && "r-placeholder",
      props.disabled && "r-disabled",
      props.readonly && "r-readonly",
    ]);

    const handleSubmit = (event) => {
      const val = event?.value || "";
      emit("submit", { field: props.id, value: val });
    };

    const handleFocus = (event) => {
      isFocused.value = true;
      emit("focus", event.target.value);
    };
    const handleInput = (event) => {
      emit("input", event.target.value);
    };

    const handleBlur = (event) => {
      isFocused.value = false;
      emit("blur", event.target.value);
    };

    return {
      classesList,
      handleBlur,
      handleSubmit,
      handleInput,
      handleFocus,
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
.input-box input,
.input-box::v-deep .autocomplete-input {
  padding: 16px 20px 20px 0;
  margin: 0;
  color: #292929;
  caret-color: #43b02a;
  border: 0;
  border-radius: 16px !important;
  background-color: transparent;
  height: 52px;
}
.input-box label + input,
.input-box::v-deep label + div .autocomplete-input {
  padding: 24px 20px 0 20px;
}
.input-box::v-deep .autocomplete-result-list {
  width: 100%;
  top: calc(100% + 6px) !important;
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
  transition: font-size 0.5s, top 0.5s;
  top: 20px;
  margin: 0;
  z-index: 1;
  cursor: pointer;
}

.input-box.r-focused label {
  z-index: 3;
}
.input-box.r-focused label + div {
  z-index: 2;
  position: relative;
}

.input-box.r-placeholder label,
.input-box.r-focused label,
.input-box.r-filled label {
  top: 7px;
  font-size: 0.75rem;
}
.invalid-feedback {
  display: block;
  font-size: 0.875rem;
  color: #eb5757;
  margin-top: 4px;
  margin-left: 20px;
}

.r-input-info {
  font-size: 0.875rem;
  color: #868686;
  margin-left: 20px;
  margin-top: 4px;
}
.input-box::v-deep .autocomplete .autocomplete-input:-webkit-autofill:focus,
.input-box.r-focused::v-deep .autocomplete-input:-webkit-autofill,
.input-box::v-deep .autocomplete-input:-webkit-autofill:focus,
.input-box::v-deep .autocomplete-input:-webkit-autofill,
.input-box::v-deep .autocomplete-input:-webkit-autofill:hover {
  -webkit-text-fill-color: #292929;
  -webkit-box-shadow: 0 0 0px 40rem #f2f4f5 inset;
}
</style>
