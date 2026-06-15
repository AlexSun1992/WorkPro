<template>
  <div class="search_input">
    <input
      :value="inputValue"
      :placeholder="placeholder"
      type="text"
      @input="handleInput"
    />
    <button
      v-if="currentValue"
      class="search-clear"
      @click="handleClear"
    ></button>
  </div>
</template>

<script>
export default {
  name: "SearchInput",
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
  props: {
    value: {
      type: String,
      default: "",
    },
    modelValue: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: "",
    },
  },

  data() {
    return {
      inputValue: this.modelValue !== undefined ? this.modelValue : this.value,
    };
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
  },
  watch: {
    value(newValue) {
      if (this.modelValue === undefined) {
        this.inputValue = newValue;
      }
    },
    modelValue(newValue) {
      this.inputValue = newValue;
    },
  },
  methods: {
    handleInput(event) {
      const val = event.target.value.trimStart();
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", val);
      this.$emit("update:modelValue", val);
    },
    handleClear() {
      this.inputValue = "";
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", "");
      this.$emit("update:modelValue", "");
      this.$emit("clear");
    },
  },
};
</script>

<style scoped>
.search_input {
  padding: 0 0px;
  position: relative;
}
.control-select-object-from-map .search_input {
  padding: 0 20px;
}
.search-clear {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 50%;
  transform: translateY(-7px);
  border: 0;
  right: 16px;
  display: block;
  box-sizing: border-box;
  background: 0 0;
}
.control-select-object-from-map .search-clear {
  right: 32px;
  transform: translateY(-7px);
}

.search-clear:after,
.search-clear:before {
  width: 13px;
  position: absolute;
  top: 6px;
  left: 0;
  background-color: #868686;
  transform: rotate(45deg);
  content: "";
  height: 2px;
  display: block;
  transition: 0.3s;
}
.search-clear:hover:after,
.search-clear:hover:before {
  background-color: #686868;
  transition: 0.3s;
}

.search-clear:after {
  transform: rotate(-45deg);
}
.map-list .search_input input {
  padding-right: 32px;
  padding-left: 49px;
  background: url(/img/icon-search_dms.svg) left 15px center no-repeat !important;
  width: 260px;
  height: 36px;
  border: 1px solid var(--warmgrey_40, #c3c3c3) !important;
}
.map-list .search_input input:hover {
  border: 1px solid var(--warmgrey) !important;
}

.control-select-object-from-map .map-list .search_input input {
  width: 100%;
  height: 56px;
  padding-right: 32px;
}
.search_input {
  text-align: right;
}

@media (max-width: 992px) {
  .map-list .search_input input {
    width: 100%;
  }
  .control-select-object-from-map .map-list .search_input input {
    margin-top: 0;
  }
  .map-list .search_input input {
    padding-right: 32px;
    padding-left: 49px;
    background: #fff;
    height: 56px;
  }
  .search-clear {
    transform: translateY(-7px);
  }
}
</style>
