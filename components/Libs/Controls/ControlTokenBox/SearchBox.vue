<template>
  <div class="search-box">
    <input
      type="text"
      :class="['search-input', simple && 'simple']"
      :value="value"
      ref="searchInput"
      placeholder="Найти"
      @blur.stop.prevent="activateInput"
      @keyup.stop.esc="clearInput"
      @keyup.stop.enter="searchComplete"
      @input="updateValue($event.target.value)"
    />

    <div
      class="button-wrapper"
      v-if="!simple"
    >
      <button
        v-show="value"
        class="h-100 static"
        @click="clearInput"
        type="button"
      >
        X
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: {
    value: {
      default: "",
      type: String,
    },
    simple: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    updateValue(val) {
      this.$emit("input", val);
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
  mounted() {
    this.clearInput();
    this.activateInput();
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
