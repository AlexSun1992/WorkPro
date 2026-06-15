<template>
  <div class="search-box">
    <input
      ref="searchInput"
      type="text"
      :class="['search-input', simple && 'simple']"
      :value="currentValue"
      placeholder="Найти"
      @blur.stop.prevent="activateInput"
      @keyup.stop.esc="clearInput"
      @keyup.stop.enter="searchComplete"
      @input="updateValue($event.target.value)"
    />

    <div
      v-if="!simple"
      class="button-wrapper"
    >
      <button
        v-show="currentValue"
        class="h-100 static"
        type="button"
        @click="clearInput"
      >
        X
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  // TODO: Vue3 migration — удалить prop "value" и event "input" после полного перехода на Vue 3 (оставлено для обратной совместимости c v-model Vue 2)
  props: {
    value: {
      default: "",
      type: String,
    },
    modelValue: {
      default: undefined,
      type: String,
    },
    simple: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    currentValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
  },
  mounted() {
    this.clearInput();
    this.activateInput();
  },
  methods: {
    updateValue(val) {
      // TODO: Vue3 migration — удалить emit "input" после перехода на Vue 3
      this.$emit("input", val);
      this.$emit("update:modelValue", val);
    },
    clearInput() {
      this.updateValue("");
      this.$emit("clear");
    },
    activateInput() {
      this.$nextTick(() => {
        this.$refs.searchInput?.focus();
      });
    },
    searchComplete() {
      this.$emit("searchComplete");
    },
  },
};
</script>

<style scoped>
.button-wrapper {
  width: 2em;
}
.is-valid .search-box input,
.is-invalid .search-box input,
.is-valid .search-box input:hover,
.is-invalid .search-box input:hover,
.search-box input:hover,
.search-box input {
  border: 0 !important;
  padding: 0 40px;
  background: url(/img/icon-search.svg) 12px center no-repeat !important;
  font-size: 1rem;
  font-weight: 400;
  line-height: 30px;
  text-align: left;
  margin: -12px -20px;
}
button {
  border: none;
  right: 1rem;
  width: 24px;
  height: 24px;
  font-size: 0;
  background: transparent url(/img/icon-btn-close.svg) no-repeat center center;
  position: absolute;
  top: 1px;
}

button:hover {
  font-weight: 600;
}
</style>
