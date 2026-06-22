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
        :tab-index="tabIndex"
        @click-trigger="handleTriggerClick"
        @outside="closeDropdown"
        @handleBlur="closeDropdown"
        @getFocus="openDropDown"
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
              :tabindex="-1"
              enterkeyhint="next"
              @input="handleSearchInput"
              @mousedown.stop
              @keydown.tab.prevent.stop="handleSearchTab"
              @keydown.enter.prevent.stop="handleMobileNext"
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
        v-if="data.state === false"
        class="invalid-feedback"
      >
        {{ data.error ? data.error : "Обязательно для заполнения" }}
      </div>
    </form-group>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, nextTick } from "vue";
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
    tabIndex: {
      type: Number,
      default: null,
    },
  },

  emits: ["update", "gender-revealed"],

  setup(props, { emit }) {
    const searchInput = ref(null);
    const options = ref([]);
    const requestAddress = ref(null);
    const id = ref("");
    const currentValue = ref("");
    const isFieldValid = ref(null);
    const isOpen = ref(false);
    const searchQuery = ref("");
    const isSearching = ref(false);
    const currentSearchTimeout = ref(null);

    const isFIOfield = computed(() =>
      ["SECONDNAME", "FIRSTNAME", "THIRDNAME"].some((name) => props.data.name.includes(name))
    );

    const isVehicleModelField = computed(() =>
      ["SVEHICLE_MODEL", "SVEHICLE_MODEL_CASCO"].some((name) => props.data.name.includes(name))
    );

    const placeholder = computed(() => props.data.placeholder);
    const disabled = computed(() => !props.edit || props.data.readonly);

    const getCurrentValue = computed(() => {
      if (props.data.value == null) return props.data.value;
      if (isVehicleModelField.value && typeof props.data.value === "string") {
        return props.data.value.includes("|") ? props.data.value.split("|")[1] : props.data.value;
      }
      if (isVehicleModelField.value && typeof props.data.value === "object") {
        return props.data.value.brand_model_modification;
      }
      return props.data.value;
    });

    const inputDisplayValue = computed(() => (isOpen.value ? searchQuery.value : getCurrentValue.value ?? ""));

    const showNoneFound = computed(() => !isSearching.value && searchQuery.value && options.value.length === 0);

    const validClass = computed(() => {
      if (isFieldValid.value === true) return "is-valid";
      if (typeof isFieldValid.value !== "object" && isFieldValid.value === false) return "is-invalid";
      if (props.data.state != null) return props.data.state === true ? "is-valid" : "is-invalid";
      if (isFieldValid.value === null) return "";
      return "";
    });

    function handleTriggerClick(ev) {
      const el = searchInput.value;
      if (ev.target === el || el?.contains(ev.target)) return;
      if (disabled.value) return;

      isOpen.value = !isOpen.value;
      if (isOpen.value) {
        isSearching.value = true;
        searchQuery.value = getCurrentValue.value ?? "";
        nextTick(() => searchInput.value?.focus());
      }
    }

    function openDropDown(e) {
      if (disabled.value) {
        return;
      }
      isOpen.value = true;
      isSearching.value = true;
      searchQuery.value = getCurrentValue.value ?? "";
      nextTick(() => {
        searchInput.value?.focus();
      });
    }

    function handleSearchInput(e) {
      if (!e) return;
      isSearching.value = true;
      isOpen.value = true;
    }

    function closeDropdown() {
      isOpen.value = false;

      isSearching.value = false;

      const exactMatch = options.value.find((item) => searchQuery.value.toUpperCase() === item.value.toUpperCase());
      if (exactMatch !== undefined) {
        if (isVehicleModelField.value) searchQuery.value = exactMatch.value;
        isFieldValid.value = true;
      }

      if (isFIOfield.value && searchQuery.value.length) {
        handleSubmit({ value: searchQuery.value.trim() });
      }

      if (!getCurrentValue.value) {
        searchQuery.value = "";
      }
    }

    function handleSearchTab(e) {
      closeDropdown();
      const currentIndex = props.tabIndex;

      const nexIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;

      nextTick(() => {
        const nextElement = document.querySelector(`[tabindex="${nexIndex}"]`);
        if (nextElement) {
          nextElement.focus();
        }
      });
    }

    function handleMobileNext() {
      closeDropdown();
      const currentIndex = Number(props.tabIndex);

      const nexIndex = currentIndex + 1;

      nextTick(() => {
        const nextElement = document.querySelector(`[tabindex="${nexIndex}"]`);
        if (nextElement) {
          nextElement.focus();
        }
      });
    }

    function selectItem(item) {
      searchQuery.value = item.value;
      isOpen.value = false;
      handleSubmit(item);
    }

    async function search(input) {
      isFieldValid.value = null;

      if (isFIOfield.value && input.charAt(0) === " ") {
        options.value = [];
        return [];
      }
      const regex = props.data.regex || /^[а-яА-ЯёЁ]?([а-яА-ЯёЁ]+-?[а-яА-ЯёЁ]+)?\s*?$/;
      if (isFIOfield.value && isFieldFIONotValid(input, regex)) {
        options.value = [];
        return options.value;
      }
      if (input.length < 1) {
        options.value = [];
        return [];
      }

      options.value = [];
      const { query, body, id: newId } = getQueryParams(props.data.name, input, props.gender);
      if (newId) id.value = newId;

      const response = await fetch(`/api/suggestions/${query}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      options.value = result.suggestions;
      isSearching.value = false;
      return options.value;
    }
    function handleSubmit(result) {
      const isVehicle = isVehicleModelField.value;
      if (isVehicle) {
        currentValue.value = result.data?.brand_model_modification;
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: result.data,
        });
      } else {
        const hasPrefix = !isFIOfield.value && id.value;
        const prefix = result?.data?.[id.value] || "";
        const finalValue = hasPrefix ? `${prefix}|${result?.value}` : result?.value;
        currentValue.value = finalValue?.trim();
        emit("update", {
          fieldId: props.data.fieldId,
          name: props.data.name,
          value: finalValue,
        });
        if (isFIOfield.value) {
          emit("gender-revealed", {
            gender: result?.data ? result.data.gender : "UNKNOWN",
            name: props.data.fieldId,
          });
        }
      }
      document.activeElement?.blur();
    }

    watch(searchQuery, (newVal, oldVal) => {
      if (newVal !== oldVal) {
        clearTimeout(currentSearchTimeout.value);
        currentSearchTimeout.value = setTimeout(() => {
          search(newVal);
        }, 300);
      }
    });

    onMounted(async () => {
      if (props.data.value && typeof props.data.value === "string" && isVehicleModelField.value) {
        const reserveGroup = await search(props.data.value);
        const exactMatch = reserveGroup.find((i) => props.data.value.toUpperCase() === i.value.toUpperCase());
        if (exactMatch) {
          emit("update", {
            fieldId: props.data.fieldId,
            name: props.data.name,
            value: exactMatch?.data,
          });
          isFieldValid.value = true;
        }
      }
    });
    return {
      searchInput,
      options,
      id,
      currentValue,
      isFieldValid,
      isOpen,
      searchQuery,
      isSearching,
      currentSearchTimeout,
      isFIOfield,
      isVehicleModelField,
      placeholder,
      disabled,
      getCurrentValue,
      inputDisplayValue,
      showNoneFound,
      validClass,
      handleTriggerClick,
      handleSearchInput,
      closeDropdown,
      selectItem,
      search,
      handleSubmit,
      openDropDown,
      handleSearchTab,
      handleMobileNext,
    };
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
