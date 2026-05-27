<template>
  <div>
    <form-group :class="{ required: data.required }">
      <label :for="data.name">
        {{ data.label }}
        <span
          v-if="data.helpText"
          class="position-relative"
          >&nbsp;
          <span class="tooltipster">
            (?)<vue-easy-tooltip
              :with-arrow="true"
              position="top"
              :offset="4"
            >
              <span v-html="data.helpText" /></vue-easy-tooltip></span
        ></span>
      </label>
      <ControlDropdownBase
        :is-open="isOpen"
        :is-disabled="disabled"
        :valid-class="validClass"
        @click-trigger="handleTriggerClick"
        @outside="closeDropdown"
      >
        <template #trigger>
          <div
            v-if="!inputDisplayValue"
            class="placeholder"
          >
            {{ placeholder }}
          </div>
          <span v-else>{{ inputDisplayValue }}</span>
        </template>

        <template #menu>
          <li>
            <input
              v-model="searchQuery"
              ref="searchInput"
              type="text"
              class="combobox-search-input"
              placeholder="Найти"
              autocomplete="off"
              @input="handleSearchInput"
              @mousedown.stop
            />
          </li>
          <li
            v-for="item in options"
            :key="item.value"
            class="item"
            :class="{ 'selected-option': String(item.value) === String(data.value) }"
            @mousedown.prevent.stop="selectItem(item)"
          >
            <span>{{ item.value }}</span>
          </li>
          <li
            v-if="showNoneFound"
            class="disabled"
          >
            Нет подходящих значений
          </li></template
        >
      </ControlDropdownBase>
      <div
        class="invalid-feedback"
        v-if="data.state === false"
      >
        {{ data.error ? data.error : "Обязательно для заполнения" }}
      </div>
    </form-group>
  </div>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import { isFieldFIONotValid, getQueryParams } from "./controlDadataSelect.helper";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";

export default {
  name: "ControlDadataSelect",
  components: { ControlDropdownBase, FormGroup },
  props: {
    data: {
      type: Object,
      required: true,
    },
    edit: {
      type: Boolean,
      required: true,
    },
    gender: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      options: [],
      requestAddress: null,
      id: "",
      currentValue: "",
      isFieldValid: null,
      isOpen: false,
      searchQuery: "",
      isSearching: false,
      currentSearchTimeout: null,
    };
  },

  async mounted() {
    if (
      this.data.value &&
      typeof this.data.value === "string" &&
      (this.data.name === "SVEHICLE_MODEL" || this.data.name === "SVEHICLE_MODEL_CASCO")
    ) {
      const reserveGroup = await this.search(this.data.value);
      const exactMatch = reserveGroup.find((i) => this.data.value.toUpperCase() === i.value.toUpperCase());

      if (exactMatch) {
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: exactMatch?.data,
        });
        this.isFieldValid = true;
      }
    }
  },

  computed: {
    inputDisplayValue() {
      if (this.isOpen) return this.searchQuery;
      return this.getCurrentValue ?? "";
    },
    showNoneFound() {
      return !this.isSearching && this.searchQuery && this.options.length === 0;
    },
    placeholder() {
      return this.data.placeholder;
    },
    disabled() {
      return !this.edit || this.data.readonly;
    },
    validClass() {
      if (this.isFieldValid === true) {
        return "is-valid";
      }
      if (typeof this.isFieldValid !== "object" && this.isFieldValid === false) {
        return "is-invalid";
      }

      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      if (this.isFieldValid === null) {
        return "";
      }
      return "";
    },
    getCurrentValue() {
      if (
        this.data.value !== undefined &&
        this.data.value !== null &&
        this.isVehicleModelField &&
        typeof this.data.value === "string"
      ) {
        if (this.data.value.indexOf("|") !== -1) {
          return this.data.value.split("|")[1];
        }
        return this.data.value;
      }

      if (this.isVehicleModelField && typeof this.data.value === "object") {
        return this.data.value.brand_model_modification;
      }

      return this.data.value;
    },

    isFIOfield() {
      return ["SECONDNAME", "FIRSTNAME", "THIRDNAME"].some((name) => this.data.name.includes(name));
    },

    isVehicleModelField() {
      return ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].some((name) => this.data.name.includes(name));
    },
  },

  watch: {
    searchQuery(newSearchQuery, oldSearchQuery) {
      if (newSearchQuery !== oldSearchQuery) {
        clearTimeout(this.currentSearchTimeout);
        this.currentSearchTimeout = setTimeout(() => {
          this.search(newSearchQuery);
        }, 300);
      }
    },
  },

  methods: {
    handleTriggerClick(ev) {
      const searchEl = this.$refs.searchInput;
      if (ev.target === searchEl || searchEl?.contains(ev.target)) {
        return;
      }
      if (this.disabled) {
        return;
      }

      this.isOpen = !this.isOpen;

      if (this.isOpen) {
        this.isSearching = true;
        this.searchQuery = this.getCurrentValue ?? "";
        this.$nextTick(() => this.$refs.searchInput?.focus());
      }
    },
    handleSearchInput(e) {
      if (!e) {
        return;
      }
      this.isSearching = true;

      this.isOpen = true;
      this.isErr = null;
    },
    closeDropdown() {
      this.isOpen = false;
      this.isSearching = false;

      const exactMatch = this.options.find((item) => this.searchQuery.toUpperCase() === item.value.toUpperCase());

      if (exactMatch !== undefined) {
        this.handleSubmit(exactMatch);

        if (this.isVehicleModelField) {
          this.searchQuery = exactMatch.value;
        }

        this.isFieldValid = true;
      }

      if (this.isFIOfield && this.searchQuery.length) {
        this.handleSubmit({ value: this.searchQuery.trim() });
      }

      if (!this.getCurrentValue) {
        this.searchQuery = "";
      }
    },
    selectItem(item) {
      this.searchQuery = item.value;
      this.isOpen = false;
      this.validationErrorText = null;
      this.isSelectedItem = item;
      this.handleSubmit(item);
    },

    async search(input) {
      this.isFieldValid = null;

      if (this.isFIOfield && input.charAt(0) === " ") {
        input = "";
        return [];
      }
      const regex = this.data.regex || /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;

      const isInputNotValid = isFieldFIONotValid(input, regex);

      if (this.isFIOfield && isInputNotValid) {
        this.options = [];
        return this.options;
      }

      if (input.length < 1) {
        this.options = [];
        return [];
      }
      this.options = [];
      const { query, body, id } = getQueryParams(this.data.name, input, this.gender);

      if (id) {
        this.id = id;
      }

      const response = await fetch(`/api/suggestions/${query}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      this.options = result.suggestions;

      this.isSearching = false;

      return this.options;
    },

    handleSubmit(result) {
      const isVehicleField = ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].includes(this.data.name);

      if (isVehicleField) {
        this.currentValue = result.data?.brand_model_modification;
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: result.data,
        });
      }

      if (!isVehicleField) {
        const hasPrefix = !this.isFIOfield && this.id;
        const prefix = result?.data?.[this.id] || "";
        const finalValue = hasPrefix ? `${prefix}|${result?.value}` : result?.value;

        this.currentValue = finalValue?.trim();
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: finalValue,
        });
        if (this.isFIOfield) {
          const genderToEmit = result?.data ? result.data.gender : "UNKNOWN";
          this.$emit("gender-revealed", { gender: genderToEmit, name: this.data.fieldId });
        }
      }

      document.activeElement.blur();
    },
  },
};
</script>

<style scoped>
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
</style>
