<template>
  <div>
    <ControlDropdownBase
      :is-open="isOpen"
      :is-disabled="isDisabled"
      @click-trigger="toggleDropdown"
      @outside="closeDropdown"
    >
      <template #trigger>
        <div
          v-if="!selectedDisplayText"
          class="placeholder"
        >
          {{ placeholder || "Выберите из списка" }}
        </div>
        <span
          v-else
          class="dw-result"
          >{{ selectedDisplayText }}</span
        >
      </template>

      <template #menu>
        <li v-if="filteredOptions.length > 5 || searchValue">
          <SearchBox
            v-model="searchValue"
            @input="updateSearchValue"
          />
        </li>
        <li
          v-for="item in filteredOptions"
          :key="item[optionsValue]"
          :class="{ 'selected-option': isSelectedItem(item) }"
          @mousedown.prevent.stop="selectItem(item)"
        >
          <span>{{ displayText(item) }}</span>
        </li>

        <li v-if="loading && !filteredOptions.length">Загрузка....</li>
        <li
          v-if="!loading && !filteredOptions.length"
          class="disabled"
        >
          Нет подходящих значений
        </li>
      </template>
    </ControlDropdownBase>
  </div>
</template>

<script>
import { computed, ref, onMounted } from "vue";
import ControlDropdownBase from "./ControlDropdownBase.vue";
import SearchBox from "./ControlTokenBox/SearchBox.vue";

export default {
  name: "ControlWrapperSelect",
  components: { ControlDropdownBase, SearchBox },
  props: {
    options: {
      type: Array,
      default: () => [],
    },
    itemValue: {
      type: Object,
      default: () => ({}),
    },
    optionsValue: {
      type: String,
      default: "ID",
    },
    loading: {
      type: Boolean,
      default: false,
    },
    selectId: {
      type: String,
      required: true,
    },
    displayText: {
      type: Function,
      required: true,
    },
    placeholder: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["selectItem", "openList"],
  setup(props, { emit }) {
    const isOpen = ref(false);
    const searchValue = ref("");

    const selectedDisplayText = computed(() => {
      if (!props.itemValue || !Object.keys(props.itemValue).length) {
        return null;
      }

      return props.displayText(props.itemValue);
    });

    const filteredOptions = computed(() => {
      if (!searchValue.value) {
        return props.options;
      }

      const query = searchValue.value.toLowerCase();

      return props.options.filter((item) => {
        const text = props.displayText(item);

        return text && text.toLowerCase().includes(query);
      });
    });

    const toggleDropdown = (open) => {
      if (props.isDisabled) {
        return;
      }

      isOpen.value = open ?? !isOpen.value;
      emit("openList");

      if (!isOpen.value) {
        searchValue.value = "";
      }
    };

    const closeDropdown = () => {
      if (!isOpen.value) {
        return;
      }

      isOpen.value = false;
      searchValue.value = "";

      emit("openList");
    };

    const selectItem = (item) => {
      emit("selectItem", item);

      isOpen.value = false;
      searchValue.value = "";
    };

    const updateSearchValue = () => {
      toggleDropdown(true);
    };

    const isSelectedItem = (item) => {
      if (!props.itemValue || !Object.keys(props.itemValue).length) {
        return false;
      }

      return item[props.optionsValue] === props.itemValue[props.optionsValue];
    };

    onMounted(() => {
      if (props.itemValue && Object.keys(props.itemValue).length) {
        emit("selectItem", props.itemValue);
      }
    });

    return {
      isOpen,
      searchValue,
      selectedDisplayText,
      filteredOptions,
      toggleDropdown,
      closeDropdown,
      selectItem,
      updateSearchValue,
      isSelectedItem,
    };
  },
};
</script>

<style scoped>
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
