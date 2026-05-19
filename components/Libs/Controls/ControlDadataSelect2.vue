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
        class="result"
        v-if="data.readonly === true"
      >
        {{ getCurrentValue }}
      </div>
      <div
        v-if="data.state === false"
        class="invalid-feedback d-block"
      >
        {{ data.error || "Обязательно для заполнения" }}
      </div>
    </form-group>
  </div>
</template>

<script>
import FormGroup from "@/components/Libs/FormGroup/FormGroup";
import ControlDropdownBase from "@/components/Libs/Controls/ControlDropdownBase";

import { getQueryParams } from "./controlDadataSelect.helper";

export default {
  name: "ControlDadataSelect2",
  components: { ControlDropdownBase, FormGroup },
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
  },
  data() {
    return {
      options: [],
      id: "",
      valueHub: [],
      isOpen: false,
      searchQuery: "",
      isSearching: false,
      currentSearchTimeout: null,
    };
  },

  computed: {
    disabled() {
      return !this.edit || this.data.readonly;
    },
    placeholder() {
      return this.data.placeholder ?? "Выберите из списка";
    },
    inputDisplayValue() {
      if (this.isOpen) {
        return this.searchQuery;
      }
      return this.getCurrentValue ?? "";
    },
    showNoneFound() {
      return !this.isSearching && this.searchQuery && this.options.length === 0;
    },

    validClass() {
      if (this.data.state !== null && this.data.state !== undefined) {
        return this.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    },
    getCurrentValue() {
      if (this.data.value !== undefined && this.data.value !== null) {
        try {
          const data = JSON.parse(this.data.value);
          if (typeof data === "string") {
            return data;
          }
          return data.value;
        } catch (e) {
          return this.data.value?.value ?? this.data.value;
        }
      }
      return this.data.value;
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
    validClass(newValidClass) {
      if (this.data.state === false && newValidClass === "is-invalid" && this.data.required) {
        this.validationErrorText = "Обязательно для заполнения";
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
      if (input.length < 1) {
        this.options = [];
        return [];
      }

      const { query, body, id } = getQueryParams(this.data.name, input);

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
      if (this.valueHub.length > 0) {
        this.valueHub.shift();
      }
      this.valueHub.push(result.value);
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.id ? `${result.data[this.id] || ""}|${result.value}` : result,
      });
    },
  },
};
</script>

<style scoped>
.invalid-feedback {
  display: block !important;
  opacity: 1 !important;
  visibility: visible !important;
}
.result {
  border: 1px solid var(--warmgrey_40) !important;
  background: #f2f2f2 !important;
  color: var(--warmgrey_40) !important;
  pointer-events: none;
  padding: 14px 20px !important;
  background: var(--white);
  border: 1px solid var(--warmgrey_40);
  border-radius: 15px;
  font-family: "SF Pro Display";
  font-style: normal;
  font-weight: 400;
  font-size: 1rem;
  display: none;
}
.full-dadata::v-deep .autocomplete-input:disabled {
  display: none;
}
.full-dadata::v-deep .result {
  display: block;
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
</style>
