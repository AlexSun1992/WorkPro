<template>
  <b-form-group
    :label="data.label"
    :class="{ required: data.required }"
    :label-for="data.name"
  >
    <template #label>
      <span v-html="data.label" />
      <span
        v-if="data.helpText"
        class="position-relative"
        >&nbsp;
        <span class="tooltipster">
          (?)<vue-easy-tooltip
            position="top"
            :offset="4"
          >
            <span v-html="data.helpText" /></vue-easy-tooltip></span
      ></span>
    </template>

    <ControlDropdownBase
      :isOpen="isOpen"
      :isDisabled="isComboboxDisabled"
      :validClass="validClass"
      @click-trigger="handleTriggerClick"
      @toggle="handleToggleBtn"
      @outside="closeDropdown"
    >
      <template #trigger>
        <input
          v-model="inputText"
          v-mask="data.mask"
          ref="input"
          type="text"
          class="autocomplete-input"
          :id="data.name"
          :placeholder="placeholder"
          :disabled="isComboboxDisabled"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          autocomplete="off"
        />
      </template>

      <template #menu>
        <li
          v-for="item in availableOptions"
          :key="item.value"
          :class="{ 'selected-option': item.value === Number(data.value) }"
          @mousedown.prevent.stop="selectItem(item)"
        >
          <span>{{ item.text }}</span>
        </li>
        <li
          v-if="!availableOptions.length"
          class="disabled"
        >
          Нет подходящих значений
        </li>
      </template>
    </ControlDropdownBase>

    <b-form-invalid-feedback :state="isErr || isInvalidClass">
      {{ data.error ? data.error : validationErrorText }}
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
import { BFormGroup } from "bootstrap-vue";
import { findUnSensitiveCaseCoincidence } from "./ControlCustomCombobox.helper";
import { applyMask as _mask } from "@/utils/utils";
import ControlDropdownBase from "../ControlDropdownBase.vue";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every(({ value }) => value !== undefined && value !== null && value !== "");
}

export default {
  name: "ControlCustomCombobox",
  components: {
    BFormGroup,
    ControlDropdownBase,
  },
  directives: {
    mask: _mask,
  },
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
    oneToManyData: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      inputText: "",
      isOpen: false,
      validationErrorText: null,
      isStatusRequired: null,
      isTouch: false,
    };
  },
  mounted() {
    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });
    }

    this.inputText = this.getCurrentValue ?? "";
  },
  computed: {
    isRequired() {
      return this.data.required;
    },
    isErr() {
      return this.data.state;
    },
    isEditable() {
      return this.edit;
    },
    isDisabledByRelation() {
      return calcDisabledByRelation(this.fieldsRelations);
    },
    fieldsRelations() {
      if (this.data.fieldRelation) {
        return this.$store.getters["data_card/getDataFieldsByNames"](this.data.fieldRelation.split(";"));
      }
      return [];
    },
    isComboboxDisabled() {
      return !this.isEditable || this.data.readonly || this.isDisabledByRelation;
    },
    validClass() {
      if (this.isErr === false && this.data.required) {
        return "is-invalid";
      }
      if (this.isErr === true && this.data.required) {
        return "is-valid";
      }

      if (this.data.state !== null && this.data.state !== undefined && this.data.required && this.isErr !== null) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }

      return "";
    },
    isInvalidClass() {
      return this.validClass !== "is-invalid";
    },
    placeholder() {
      return this.data.placeholder;
    },
    getCurrentValue() {
      return this.data.options.find((item) => item.value == this.data?.value)?.text;
    },
    availableOptions() {
      const query = this.inputText;
      if (!query || query === this.getCurrentValue) {
        return this.data.options;
      }
      return this.data.options.filter((item) => findUnSensitiveCaseCoincidence(item.text, query));
    },
  },
  watch: {
    getCurrentValue(value, oldValue) {
      // Повторяет поведение оригинального watcher'а: обновляет инпут и валидирует
      this.inputText = value ?? "";

      if (value !== oldValue || (!value && !oldValue)) {
        this.updateValue();
      }
      // Сбрасываем isTouch здесь, так как после изменения в handleBlur всё равно срабатывает watch для getCurrentValue
      this.isTouch = false;
    },
    validClass(value) {
      if (this.data.state === false && value === "is-invalid" && this.data.required) {
        this.validationErrorText = "Обязательно для заполнения";
      }
    },
    isRequired(value) {
      if (value === false) {
        this.validationErrorText = null;
      }
    },
  },
  methods: {
    handleInput() {
      this.isOpen = true;

      if (this.inputText) {
        const findValueInList = this.data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, this.inputText));

        if (findValueInList === undefined) {
          this.updateState(false, `По фразе "${this.inputText}" ничего не найдено`);
        }

        if (findValueInList !== undefined) {
          this.updateState(true, null);
        }
      }
    },
    handleFocus() {
      if (!this.isComboboxDisabled) {
        this.isOpen = true;
      }
    },
    handleTriggerClick(ev) {
      if (ev.target === this.$refs.input) return;
      if (!this.isComboboxDisabled) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) this.$nextTick(() => this.$refs.input?.focus());
      }
    },
    handleToggleBtn() {
      if (!this.isComboboxDisabled) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) this.$nextTick(() => this.$refs.input?.focus());
      }
    },
    selectItem(item) {
      this.handleSubmit(item);
      this.isOpen = false;
    },
    closeDropdown() {
      this.isOpen = false;
    },
    handleBlur() {
      this.isTouch = true;
      this.updateValue();
    },
    updateValue() {
      if (!this.inputText) {
        const value = this.data.options.find((item) => item.value === Number(this.data?.value));

        this.updateState(this.isTouch ? true : null, null);

        if ((value === undefined || value === null) && this.data.required && this.isTouch) {
          this.updateState(false, "Обязательно для заполнения");
          this.inputText = "";
        }
        if (value) {
          this.inputText = value.text;
          this.handleSubmit(value);
        }
      } else {
        const find = this.data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, this.inputText));

        if (find !== undefined) {
          this.updateState(this.isTouch ? true : null, null);
          this.handleSubmit(find);
        } else {
          this.inputText = "";

          if (!this.isRequired) {
            this.updateState(this.isTouch ? true : null, null);
          }

          this.validationErrorText = this.isRequired && this.isTouch ? "Выберите значение из выпадающего списка" : null;

          this.handleSubmit(null);
        }
      }
    },
    handleSubmit(result) {
      document.activeElement.blur();
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: result?.value ?? null,
      });
    },
    updateState(state, message) {
      this.$store.commit("data_card/setFieldState", {
        fieldId: this.data?.fieldId,
        state,
        error: message,
        oneToManyData: this.oneToManyData,
      });
    },
  },
};
</script>

<style scoped>
.autocomplete-input {
  border: none;
  outline: none;
  background: transparent;
  width: 100%;
  font-size: 18px;
  font-weight: 400;
  min-height: 30px;
  flex: 1;
  padding: 0;
  color: inherit;
}

.autocomplete-input:disabled {
  cursor: not-allowed;
  color: #6c757d;
}
</style>
