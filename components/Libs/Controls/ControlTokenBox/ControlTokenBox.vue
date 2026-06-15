<template>
  <div>
    <label
      :for="data.id"
      class="d-block"
    >
      <span>{{ data.label }}</span>
    </label>

    <ControlDropdownBase
      :is-open="isOpen"
      menu-class="control-multiselect"
      @click-trigger="clickSelectedBox"
      @outside="toggleDropdown(false)"
    >
      <template #trigger>
        <div class="selected-items">
          <SearchBox
            v-if="getSearchBoxPosition === searchBoxType['inline']"
            v-model="searchValue"
            @input="updateSearchValue"
            @clear="isSearchActive = true"
            @searchComplete="searchComplete"
          />

          <div
            v-if="!selectedItems.length"
            class="placeholder"
          >
            {{ placeholder }}
          </div>
          <template v-else>
            <div
              v-for="item in selectedItems"
              :key="item[valueKey]"
              class="selected-value"
            >
              <slot
                name="selectedItem"
                :item="item"
              >
                <span> {{ item ? item[textKey] : "" }}&nbsp; </span>
              </slot>

              <div
                v-if="showClear"
                class="clear-btn"
                @click.stop="clearSelectedItem(item)"
              >
                X
              </div>
            </div>
          </template>

          <SearchBox
            v-if="getSearchBoxPosition === searchBoxType['inlineReverse']"
            v-model="searchValue"
            @input="updateSearchValue"
            @clear="isSearchActive = true"
            @searchComplete="searchComplete"
          />

          <div
            v-if="showClearAll"
            class="clear-btn clear-all-btn"
            @click.stop="clearAll()"
          >
            X
          </div>
        </div>
      </template>

      <template #menu>
        <li v-if="getSearchBoxPosition === searchBoxType['dropdown']">
          <SearchBox
            v-model="searchValue"
            @input="updateSearchValue"
            @clear="isSearchActive = true"
            @searchComplete="searchComplete"
          />
        </li>

        <template v-for="item in availableOptions">
          <li
            v-if="item.invisible !== true"
            :key="item[valueKey]"
            :class="{
              'selected-option': isSelectedItem(item) && !item.invisible,
              disabled: item.disabled,
            }"
            @keydown.prevent.enter="!item.disabled && selectItem(item)"
            @mousedown.prevent.stop="!item.disabled && selectItem(item)"
          >
            <slot
              name="optionItem"
              :item="item"
            >
              <span v-html="item[textKey]" />
            </slot>
          </li>
        </template>

        <li v-if="getSearchBoxPosition === searchBoxType['dropdownReverse']">
          <SearchBox
            v-model="searchValue"
            @input="updateSearchValue"
            @clear="isSearchActive = true"
            @searchComplete="searchComplete"
          />
        </li>

        <li
          v-if="!availableOptions.length"
          class="disabled"
        >
          {{ noOptionsText }}
        </li>
      </template>
    </ControlDropdownBase>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";
import SearchBoxType from "./searchBoxType";
import ControlDropdownBase from "../ControlDropdownBase.vue";

export default {
  name: "ControlTokenBox",
  components: { SearchBox, ControlDropdownBase },
  props: {
    data: {
      type: Object,
      default: () => ({
        value: [],
      }),
      required: true,
    },
    searchable: {
      type: Boolean,
      default: true,
    },
    noOptionsText: {
      type: String,
      default: "Нет подходящих значений",
    },
    // Возможные значения: inline, inlineReverse, dropdown, dropdownReverse
    showSearchIn: {
      type: String,
      default: SearchBoxType.dropdown,
    },
  },
  data() {
    return {
      isOpen: false,
      searchValue: "",
      isSearchActive: false,
    };
  },
  computed: {
    options() {
      return this.data.options ?? [];
    },
    filteredOptions() {
      return this.options.filter((item) => {
        const searchValue = this.searchValue.toLowerCase();
        const itemValue = item[this.textKey].toLowerCase();

        return itemValue.includes(searchValue);
      });
    },
    optionsWithHelp() {
      const options = this.filteredOptions;
      const { searchValue } = this;

      if (!searchValue) {
        return options;
      }

      return options.map((item) => ({
        ...item,
        [this.textKey]: this.replaceAllMatches(item[this.textKey]),
      }));
    },
    availableOptions() {
      return this.searchable ? this.optionsWithHelp : this.filteredOptions;
    },
    selectedItems() {
      return this.value.length ? this.value.map((item) => this.options.find((i) => i[this.valueKey] === item)) : [];
    },
    placeholder() {
      return this.data.placeholder ?? "";
    },
    textKey() {
      return this.data?.textKey ?? "text";
    },
    valueKey() {
      return this.data?.valueKey ?? "value";
    },
    showClear() {
      return this.data?.showClear ?? true;
    },
    showClearAll() {
      return Boolean(this.selectedItems.length);
    },
    closeAfterSelect() {
      const val = this.data.closeAfterSelect;

      return typeof val === "boolean" ? val : false;
    },
    value() {
      return this.data?.value ?? [];
    },
    showSearchBox() {
      return this.searchable && this.isOpen;
    },
    searchBoxType() {
      return SearchBoxType;
    },
    getSearchBoxPosition() {
      const val = this.searchBoxType[this.showSearchIn] ?? null;

      return this.showSearchBox ? val : null;
    },
  },
  methods: {
    selectItem(item) {
      const currentValue = [...this.value];
      const idValue = item[this.valueKey];

      if (this.isSelectedItem(item)) {
        this.clearSelectedItem(item);
      } else {
        currentValue.push(idValue);
        this.$emit("update", {
          fieldId: this.data.fieldId,
          name: this.data.name,
          value: currentValue,
        });
      }

      if (this.closeAfterSelect) {
        this.toggleDropdown();
      }
    },
    clearSelectedItem(item) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.value.filter((val) => val !== item[this.valueKey]),
      });
    },
    clearAll() {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: [],
      });
    },
    clickSearchBox() {
      this.isSearchActive = true;
    },
    clickSelectedBox(ev) {
      if (!ev.target.closest(".search-box")) {
        this.toggleDropdown();
      }
    },
    toggleDropdown(val) {
      this.isOpen = typeof val === "boolean" ? val : !this.isOpen;
    },
    isSelectedItem(item) {
      const currentValue = [...this.value];
      const idValue = item[this.valueKey];

      return currentValue.includes(idValue);
    },
    updateSearchValue() {
      this.toggleDropdown(true);
    },
    searchComplete() {
      const options = this.availableOptions;

      if (options.length === 1) {
        this.selectItem(options[0]);
      }
    },
    replaceAllMatches(value = "") {
      const valueLower = value.toLowerCase();
      const searchValue = this.searchValue.toLowerCase();
      let index = valueLower.indexOf(searchValue);
      let result = value.slice(0, index);

      while (index !== -1) {
        const valueInTag = `<b>${value.slice(index, index + searchValue.length)}</b>`;
        const nextIndex = valueLower.indexOf(searchValue, index + 1);
        const lastIndex = nextIndex === -1 ? value.length : nextIndex;
        const nextValue = value.slice(index + searchValue.length, lastIndex);

        result += `${valueInTag}${nextValue}`;
        index = nextIndex;
      }

      return result;
    },
  },
};
</script>
