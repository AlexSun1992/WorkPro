<template>
  <div class="dropdown-wrapper" ref="menu">
    <label :for="data.id" class="d-block">
      <span>{{ data.label }}</span>
    </label>

    <div class="header">
      <div
        class="selected-items"
        :class="{ open: isOpen }"
        @click="toggleDropdown"
      >
        <SearchBox v-if="isSearchVisibleComputed"
                   v-model="searchValue"/>

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
      </div>

      <span class="toggle-btn" @click="toggleDropdown"/>
    </div>

    <ul class="control-dropdown-menu" :class="{ visible: isOpen }">
      <template v-for="item in options">
        <li
          v-if="item.invisible !== true"
          :key="item[valueKey]"
          :class="{
            'selected-option': isSelectedItem(item) && !item.invisible,
            disabled: item.disabled,
          }"
          @keydown.prevent.enter="!item.disabled && selectItem(item)"
          @click="!item.disabled && selectItem(item)"
        >
          <slot name="optionItem" :item="item">
            {{ item[textKey] || "" }}
          </slot>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>

import SearchBox from "./SearchBox.vue";

export default {
  name: "ControlTokenBox",
  components: { SearchBox },
  props: {
    data: {
      default: {
        value: [],
      },
      required: true,
    },
    isSearchVisible: {
      default: true
    }
  },
  data() {
    return {
      isOpen: false,
      searchValue: "",
    };
  },
  computed: {
    options() {
      return (
        this.data.options ??
        []
      );
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
    closeAfterSelect() {
      const val = this.data.closeAfterSelect;

      return typeof val === "boolean" ? val : false;
    },
    value() {
      return this.data?.value ?? [];
    },
    isSearchVisibleComputed() {
      return this.isSearchVisible;
    }
  },
  methods: {
    selectItem(item) {
      const currentValue = [ ...this.value ];
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

      this.closeAfterSelect && this.toggleDropdown();
    },
    clearSelectedItem(item) {
      this.$emit("update", {
        fieldId: this.data.fieldId,
        name: this.data.name,
        value: this.value.filter((val) => val !== item[this.valueKey]),
      });
    },
    toggleDropdown(val) {
      this.isOpen = typeof val === "boolean" ? val : !this.isOpen;
    },
    isSelectedItem(item) {
      const currentValue = [ ...this.value ];
      const idValue = item[this.valueKey];

      return currentValue.includes(idValue);
    },
  },
  mounted() {
    document.addEventListener("mouseup", (e) => {
      const container = this.$refs.menu;

      if (!container?.contains(e.target)) {
        this.toggleDropdown(false);
      }
    });
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
  flex-direction: row;
  width: 100%;
  cursor: pointer;
  flex-wrap: wrap;
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
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTQuMjA3IDEuNzA3bC02IDZhLjk5Ny45OTcgMCAwMS0xLjQxNCAwbC02LTZBLjk5OS45OTkgMCAxMTIuMjA3LjI5M0w3LjUgNS41ODYgMTIuNzkzLjI5M2EuOTk5Ljk5OSAwIDExMS40MTQgMS40MTR6IiBmaWxsPSIjNDNCMDJBIi8+PC9zdmc+) 100% no-repeat;
  position: absolute;
  right: 13px;
  top: 20px;
}

.selected-items.open::after {
  transform: rotate(180deg);
}

.selected-value {
  display: flex;
  flex-direction: row;
  padding: 2px 1rem 3px 1rem;
  background: #43b02a;
  border-radius: 8px;
  margin-right: 8px;
  white-space: nowrap;
  color: #fff;
  margin: 8px 4px 8px 0;
}

.clear-btn {
  padding-left: 0.25em;
  width: 0.5em;
  height: 1em;
}

.clear-btn:hover {
  font-weight: bold;
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
</style>
