<template>
  <div class="dropdown-wrapper" ref="menu">
    <div class="header">
      <slot name="header">
        <span @click="toggleDropdown">{{
            selectedItem ? selectedItem[textKey] : placeholderComputed
          }}
        <div v-if="showClear"
              class="clear-btn"
              @click="clearSelectedItem">×</div>
        </span>

      </slot>
    </div>

    <ul class="control-dropdown-menu" :class="{ visible: isOpen }">
      <template v-for="item in optionsComputed">
        <li v-if="item.invisible !== true"
            :key="item[valueKey]"
            @click="selectItem(item)">
          <slot name="item">
            {{ item[textKey] || "" }}
          </slot>
        </li>
      </template>
    </ul>

  </div>
</template>

<script>
export default {
  name: "ControlDropdown",
  props: {
    options: {
      default: Array,
    },
    placeholder: {
      default: "",
    },
    valueKey: {
      default: "value",
    },
    textKey: {
      default: "text",
    },
    closeAfterSelect: {
      default: true,
    },
    showClear: {
      default: false,
    },
    value: null,
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    optionsComputed() {
      return this.options;
    },
    selectedItem() {
      return this.optionsComputed.find(item => item[this.valueKey] === this.value);
    },
    placeholderComputed() {
      return this.placeholder
    }
  },
  methods: {
    selectItem(val) {
      this.$emit("input", val[this.valueKey]);

      this.closeAfterSelect && this.toggleDropdown();
    },
    clearSelectedItem() {
      this.$emit("input", null);
    },
    toggleDropdown(val) {
      this.isOpen = val !== undefined ? val : !this.isOpen;
    },
    showClearComputed() {
      return this.value && this.showClear;
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
.control-dropdown-menu li {
  list-style-type: none;
  position: relative;
}

.control-dropdown-menu li:hover {
  opacity: 0.8;
  cursor: pointer;
}

.control-dropdown-menu {
  display: none;
}

.control-dropdown-menu.visible {
  display: flex;
  flex-direction: column;
  position: absolute;
  z-index: 1000;
}

.dropdown-wrapper {
  position: relative;
}

.header span {
  cursor: pointer;
  padding-right: 30px;
  background: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDE1IDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xNC4yMDY5IDEuNzA3MzFMOC4yMDY5NSA3LjcwNzMxQzguMDExOTUgNy45MDIzMSA3Ljc1NTk4IDguMDAwMjggNy40OTk5OCA4LjAwMDI4QzcuMjQzOTggOC4wMDAyOCA2Ljk4ODAxIDcuOTAyMzEgNi43OTMwMSA3LjcwNzMxTDAuNzkzMDA2IDEuNzA3MzFDMC40MDIwMDYgMS4zMTYzMSAwLjQwMjAwNiAwLjY4NDI1IDAuNzkzMDA2IDAuMjkzMjVDMS4xODQwMSAtMC4wOTc3NDk5IDEuODE1OTUgLTAuMDk3NzQ5OSAyLjIwNjk1IDAuMjkzMjVMNy40OTk5OCA1LjU4NjM0TDEyLjc5MyAwLjI5MzI1QzEzLjE4NCAtMC4wOTc3NSAxMy44MTU5IC0wLjA5Nzc1IDE0LjIwNjkgMC4yOTMyNUMxNC41OTc5IDAuNjg0MjUgMTQuNTk3OSAxLjMxNjMxIDE0LjIwNjkgMS43MDczMVoiIGZpbGw9IiM0M0IwMkEiLz4KPC9zdmc+Cg==") right center no-repeat;
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

.clear-btn {
  display: inline-block;
  color: #009639;
  background-color: ghostwhite;
  border: 1px solid #009639;
  border-radius: 50%;
  width: 1em;
  height: 1em;
  padding-left: 0.15em;
  padding-bottom: 0.2em;
  line-height: 0.9em;
}

.clear-btn:hover {
  font-weight: bold;
}
</style>
