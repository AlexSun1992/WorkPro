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
              ref="searchInput"
              v-model="searchQuery"
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
        v-if="data.readonly === true"
        class="result"
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
import { ref, computed, watch, nextTick } from "vue";

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
  emits: ["update"],

  setup(props, { emit }) {
    const searchInput = ref(null);
    const options = ref([]);
    const id = ref("");
    const valueHub = ref([]);
    const isOpen = ref(false);
    const searchQuery = ref("");
    const isSearching = ref(false);
    const currentSearchTimeout = ref(null);
    const validationErrorText = ref(null);

    const disabled = computed(() => !props.edit || props.data.readonly);
    const placeholder = computed(() => props.data.placeholder ?? "Выберите из списка");
    const getCurrentValue = computed(() => {
      if (props.data.value !== undefined && props.data.value !== null) {
        try {
          const data = JSON.parse(props.data.value);
          if (typeof data === "string") {
            return data;
          }
          return data.value;
        } catch (e) {
          return props.data.value?.value ?? props.data.value;
        }
      }
      return props.data.value;
    });
    const inputDisplayValue = computed(() => {
      if (isOpen.value) {
        return searchQuery.value;
      }
      return getCurrentValue.value ?? "";
    });
    const showNoneFound = computed(() => !isSearching.value && searchQuery.value && options.value.length === 0);

    const validClass = computed(() => {
      if (props.data.state !== null && props.data.state !== undefined) {
        return props.data.state === true ? "is-valid" : "is-invalid";
      }
      return "";
    });

    function handleTriggerClick(ev) {
      const searchEl = searchInput.value;
      if (ev.target === searchEl || searchEl?.contains(ev.target)) {
        return;
      }
      if (disabled.value) {
        return;
      }
      isOpen.value = !isOpen.value;

      if (isOpen.value) {
        isSearching.value = true;
        searchQuery.value = getCurrentValue.value ?? "";
        nextTick(() => searchInput.value?.focus());
      }
    }

    function handleSearchInput(e) {
      if (!e) return;
      isSearching.value = true;
      isOpen.value = true;
    }

    function closeDropdown() {
      isOpen.value = false;
      isSearching.value = false;
      if (!getCurrentValue.value) {
        searchQuery.value = "";
      }
    }

    function selectItem(item) {
      searchQuery.value = item.value;
      isOpen.value = false;
      validationErrorText.value = null;
      handleSubmit(item);
    }

    async function search(input) {
      if (input.length < 1) {
        options.value = [];
        return [];
      }

      const { query, body, id: newId } = getQueryParams(props.data.name, input);
      if (newId) {
        id.value = newId;
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
      options.value = result.suggestions;
      isSearching.value = false;
      return options.value;
    }

    function handleSubmit(result) {
      if (valueHub.value.length > 0) {
        valueHub.value.shift();
      }
      valueHub.value.push(result.value);
      emit("update", {
        fieldId: props.data.fieldId,
        name: props.data.name,
        value: id.value ? `${result.data[id.value] || ""}|${result.value}` : result,
      });
    }

    watch(searchQuery, (newQuery, oldQuery) => {
      if (newQuery !== oldQuery) {
        clearTimeout(currentSearchTimeout.value);
        currentSearchTimeout.value = setTimeout(() => {
          search(newQuery);
        }, 300);
      }
    });

    watch(validClass, (newValidClass) => {
      if (props.data.state === false && newValidClass === "is-invalid" && props.data.required) {
        validationErrorText.value = "Обязательно для заполнения";
      }
    });

    return {
      searchInput,
      options,
      id,
      valueHub,
      isOpen,
      searchQuery,
      isSearching,
      currentSearchTimeout,
      validationErrorText,
      disabled,
      placeholder,
      inputDisplayValue,
      showNoneFound,
      validClass,
      getCurrentValue,
      handleTriggerClick,
      handleSearchInput,
      closeDropdown,
      selectItem,
      search,
      handleSubmit,
    };
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
