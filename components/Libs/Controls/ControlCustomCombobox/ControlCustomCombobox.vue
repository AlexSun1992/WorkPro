<template>
  <form-group
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
      :is-open="isOpen"
      :is-disabled="isComboboxDisabled"
      :valid-class="validClass"
      @click-trigger="handleTriggerClick"
      @outside="closeDropdown"
    >
      <template #trigger>
        <div
          v-if="!selectedOption"
          class="placeholder"
        >
          {{ placeholder }}
        </div>
        <span
          v-else
          class="dw-result"
          >{{ selectedOption.text }}</span
        >
      </template>

      <template #menu>
        <li v-if="data.options.length > 5 || searchQuery">
          <SearchBox
            ref="searchInput"
            v-model="searchQuery"
            @input="handleSearchInput"
          />
        </li>
        <li
          v-for="item in availableOptions"
          :key="item.value"
          :class="{ 'selected-option': item.value === selectedValue }"
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

    <div
      v-if="isErr === false || validClass === 'is-invalid'"
      class="invalid-feedback"
    >
      {{ data.error ? data.error : validationErrorText }}
    </div>
  </form-group>
</template>

<script>
import { findUnSensitiveCaseCoincidence } from "./ControlCustomCombobox.helper";
import ControlDropdownBase from "../ControlDropdownBase.vue";
import SearchBox from "@/components/Libs/Controls/ControlTokenBox/SearchBox";
import FormGroup from "@/components/Libs/FormGroup/FormGroup";

export function calcDisabledByRelation(fieldsRelations) {
  return !fieldsRelations
    .filter((field) => field.visible && field.required)
    .every(({ value }) => value !== undefined && value !== null && value !== "");
}

export default {
  name: "ControlCustomCombobox",
  components: {
    SearchBox,
    FormGroup,
    ControlDropdownBase,
  },
  props: {
    data: {
      type: Object,
      default: () => {},
    },
    edit: {
      type: Boolean,
      default: false,
    },
    oneToManyData: {
      type: [Object, null],
      default: null,
    },
  },
  data() {
    return {
      searchQuery: "",
      isOpen: false,
      validationErrorText: null,
      isTouch: false,
    };
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
    selectedValue() {
      const v = this.data?.value;
      if (v == null || v === "") {
        return null;
      }
      return isNaN(v) ? v : Number(v);
    },
    selectedOption() {
      if (this.selectedValue == null) {
        return null;
      }
      return this.data.options.find((item) => item.value === this.selectedValue) ?? null;
    },
    availableOptions() {
      if (!this.searchQuery) {
        return this.data.options;
      }
      return this.data.options.filter((item) => findUnSensitiveCaseCoincidence(item.text, this.searchQuery));
    },
  },
  watch: {
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
  mounted() {
    if (this.data?.value) {
      this.$store.commit("data_card/setFormField", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: !Number(this.data?.value) ? this.data?.value : Number(this.data?.value),
      });
    }
  },
  methods: {
    handleSearchInput() {
      if (!this.searchQuery) {
        return;
      }
      const found = this.data.options.find((i) => findUnSensitiveCaseCoincidence(i.text, this.searchQuery));
      if (!found) {
        this.updateState(false, `По фразе "${this.searchQuery}" ничего не найдено`);
      } else {
        this.updateState(null, null);
      }
    },
    handleTriggerClick(ev) {
      const searchEl = this.$refs.searchInput?.$el;
      if (ev.target === searchEl || searchEl?.contains?.(ev.target)) {
        return;
      }
      if (!this.isComboboxDisabled) {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
          this.$nextTick(() => this.$refs.searchInput?.$el.focus());
        }
      }
    },
    selectItem(item) {
      this.searchQuery = "";
      this.isOpen = false;
      this.isTouch = true;
      this.validationErrorText = null;
      this.updateState(true, null);
      this.handleSubmit(item);
    },
    closeDropdown() {
      this.isOpen = false;
      this.searchQuery = "";

      if (this.isTouch && !this.selectedOption && this.isRequired) {
        this.validationErrorText = "Обязательно для заполнения";
        this.updateState(false, this.validationErrorText);
      }
    },
    handleSubmit(result) {
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
.placeholder {
  color: #adb5bd;
  font-size: 18px;
  font-weight: 400;
  min-height: 30px;
  display: flex;
  align-items: center;
}
.is-valid .combobox-search-input,
.is-valid .combobox-search-input:hover,
.combobox-search-input {
  background: url(/img/icon-search.svg) 12px no-repeat !important;
  border: 0 !important;
  font-size: 1rem;
  font-weight: 400;
  line-height: 30px;
  margin: -12px -20px;
  padding: 0 40px;
  text-align: left;
}
.dw-result {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
@media (max-width: 992px) {
  span.dw-result {
    white-space: normal;
    padding: 14px 0 14px 20px;
  }
}
</style>
