<template>
  <div>
    <ControlDropdownBase
      :isOpen="isOpen"
      :isDisabled="isDisabled"
      @click-trigger="toggleDropdown"
      @toggle="toggleDropdown"
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
  data() {
    return {
      isOpen: false,
      searchValue: "",
    };
  },
  computed: {
    selectedDisplayText() {
      if (!this.itemValue || !Object.keys(this.itemValue).length) return null;
      return this.displayText(this.itemValue);
    },
    filteredOptions() {
      if (!this.searchValue) return this.options;
      const query = this.searchValue.toLowerCase();
      return this.options.filter((item) => {
        const text = this.displayText(item);
        return text && text.toLowerCase().includes(query);
      });
    },
  },
  mounted() {
    if (this.itemValue && Object.keys(this.itemValue).length) {
      this.$emit("selectItem", this.itemValue);
    }
  },
  methods: {
    toggleDropdown(open) {
      if (this.isDisabled) return;
      this.isOpen = open ?? !this.isOpen;
      this.$emit("openList");
      if (!this.isOpen) this.searchValue = "";
    },
    closeDropdown() {
      if (!this.isOpen) return;
      this.isOpen = false;
      this.searchValue = "";
      this.$emit("openList");
    },
    selectItem(item) {
      this.$emit("selectItem", item);
      this.isOpen = false;
      this.searchValue = "";
    },
    updateSearchValue() {
      this.toggleDropdown(true);
    },
    isSelectedItem(item) {
      if (!this.itemValue || !Object.keys(this.itemValue).length) return false;
      return item[this.optionsValue] === this.itemValue[this.optionsValue];
    },
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
