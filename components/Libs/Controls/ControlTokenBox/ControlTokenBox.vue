<template>
  <div class="dropdown-wrapper" ref="menu">
    <label :for="data.id" class="d-block">
      <span>{{ data.label }}</span>
    </label>

    <div class="header">
      <div
        :class="[{ open: isOpen }, 'selected-items']"
        @click="clickSelectedBox"
      >
        <SearchBox
          v-if="getSearchBoxPosition === SearchBoxType['inline']"
          v-model="searchValue"
          @input="updateSearchValue"
          @clear="isSearchActive = true"
          @searchComplete="searchComplete"
        />

        <div v-if="!selectedItems.length" class="placeholder">
          {{ placeholder }}
        </div>

        <div
          v-else
          v-for="item in selectedItems"
          class="selected-value"
          :key="item[valueKey]"
        >
          <slot name="selectedItem" :item="item">
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

        <SearchBox
          v-if="getSearchBoxPosition === SearchBoxType['inlineReverse']"
          v-model="searchValue"
          @input="updateSearchValue"
          @clear="isSearchActive = true"
          @searchComplete="searchComplete"
        />

        <div v-if="showClearAll" class="clear-btn" @click.stop="clearAll()">
          X
        </div>
      </div>

      <span class="toggle-btn" @click="toggleDropdown" />
    </div>

    <ul :class="[{ visible: isOpen }, 'control-dropdown-menu']">
      <li v-if="getSearchBoxPosition === SearchBoxType['dropdown']">
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
          <slot name="optionItem" :item="item">
            <span v-html="item[textKey]" />
          </slot>
        </li>
      </template>

      <li v-if="getSearchBoxPosition === SearchBoxType['dropdownReverse']">
        <SearchBox
          v-model="searchValue"
          @input="updateSearchValue"
          @clear="isSearchActive = true"
          @searchComplete="searchComplete"
        />
      </li>

      <li v-if="!availableOptions.length" class="disabled">
        {{ noOptionsText }}
      </li>
    </ul>
  </div>
</template>

<script>
import SearchBox from "./SearchBox.vue";
import searchBoxType from "./searchBoxType";

export default {
  name: "ControlTokenBox",
  components: { SearchBox },
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
      default: searchBoxType.dropdown,
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

      return options.map((item) => ({ ...item, [this.textKey]: this.replaceAllMatches(item[this.textKey]) }));
    },
    availableOptions() {
      return this.searchable ? this.optionsWithHelp : this.filteredOptions;
    },
    selectedItems() {
      return this.value.map((item) =>
        this.options.find((i) => i[this.valueKey] === item)
      );
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
    SearchBoxType() {
      return searchBoxType;
    },
    getSearchBoxPosition() {
      const val = this.SearchBoxType[this.showSearchIn] ?? null;

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
    outOfClick(e) {
      const container = this.$refs.menu;

      if (!container?.contains(e.target)) {
        this.toggleDropdown(false);
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
  mounted() {
    document.addEventListener("mouseup", this.outOfClick);
  },
  beforeDestroy() {
    document.removeEventListener("mouseup", this.outOfClick);
  },
};
</script>

<style lang="scss" scoped>
header {
  border: 1px solid #c3c3c3;
  border-radius: 15px;
}

.control-dropdown-menu li {
  list-style-type: none;
  position: relative;
}

.control-dropdown-menu li:hover {
  opacity: 0.8;
  cursor: pointer;
}

.control-dropdown-menu li.disabled {
  cursor: not-allowed;
  color: gray;
  background-color: #f2f4f5;
}

.control-dropdown-menu li.disabled:hover {
  cursor: not-allowed;
  background-color: #f2f4f5;
}

.control-dropdown-menu {
  display: none;
}

.control-dropdown-menu.visible {
  display: flex;
  max-height: 25em;
  flex-direction: column;
  position: absolute;
  z-index: 1000;
}

.dropdown-wrapper {
  position: relative;
}

.control-dropdown-menu {
  position: absolute;
  top: 100%;
  text-align: left;
  width: 100%;
  border-radius: 10px;
  z-index: 1;
  background: #fff;
  margin: 0;
  padding: 0;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;

  & > li {
    margin: 0;
    padding: 12px 20px;
    border-bottom: 1px solid rgba(193, 193, 193, 0.3);
    cursor: pointer;

    &:hover {
      background: #f4f7f5;
    }
  }
}

.selected-items {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  width: 100%;
  position: relative;
  border: 1px solid #c3c3c3;
  padding: 6px 32px 4px 16px;
  border-radius: 15px;
  min-height: 54px;
}

.selected-items::after {
  cursor: pointer;
  width: 1em;
  height: 1em;
  content: "";
  /*background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuMjA3IDEuNzA3bC02IDZhLjk5Ny45OTcgMCAwMS0xLjQxNCAwbC02LTZBLjk5OS45OTkgMCAxMTIuMjA3LjI5M0w3LjUgNS41ODYgMTIuNzkzLjI5M2EuOTk5Ljk5OSAwIDExMS40MTQgMS40MTR6IiBmaWxsPSIjNDNCMDJBIi8+PC9zdmc+)    100% no-repeat;*/
  background: url(/img/icon-btn-dropdown.svg) 50% 50% no-repeat;
  position: absolute;
  right: 13px;
  top: 20px;
}

.selected-items.open::after {
  transform: rotate(180deg);
}

.selected-value {
  margin: 0;
  position: relative;
  padding: 4px 40px 4px 12px;
  height: 30px;
  background: #edf8ea;
  font-size: 18px;
  font-weight: 400;
  line-height: 1.1;
  text-align: left;
  color: #292929;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  border-radius: 1.1em;
  align-items: center;
  vertical-align: baseline;
}

.clear-btn {
  position: absolute;
  right: 12px;
  font-size: 0;
  width: 22px;
  height: 20px;
  background: transparent url(/img/icon-btn-close.svg) 50% 50% no-repeat;
  top: 6px;
  cursor: pointer;
}

.selected-option {
  background-color: #f0f3f1;
}

.control-dropdown-menu .selected-option:hover {
  background-color: #f4f7f5;
  opacity: 0.8;
}

.placeholder {
  color: gray;
  cursor: pointer;
  padding-right: 0.25em;
}

.search-input {
  border: 0px;
  padding: 0 40px;
  background: url(/img/icon-btn-dropdown.svg) 16px center no-repeat;
  font-size: 18px;
  font-weight: 400;
  line-height: 30px;
  text-align: left;
}

.search-box {
  display: block;
  width: 100%;
  clear: both;
  font-weight: 400;
  color: #212529;
  text-align: inherit;
  white-space: nowrap;
  background-color: transparent;
  border: 0;
}

.visible.control-dropdown-menu li span:before {
  content: url(/img/icon-input-valid-disabled.svg);
  position: absolute;
  right: 2px;
  width: 1rem;
  height: 1rem;
}

.visible.control-dropdown-menu li span {
  position: relative;
  display: block;
}

.visible.control-dropdown-menu li.selected-option span:before {
  content: url(/img/icon-input-valid.svg);
}

.visible.control-dropdown-menu::-webkit-scrollbar-thumb {
  background: #43b02a;
  width: 2px;
  border: 3px solid #ffff;
  border-radius: 10px;
}

.visible.control-dropdown-menu::-webkit-scrollbar {
  width: 6px;
}

.visible.control-dropdown-menu::-webkit-scrollbar:vertical {
  border: 4px solid transparent;
  width: 10px;
}
</style>
