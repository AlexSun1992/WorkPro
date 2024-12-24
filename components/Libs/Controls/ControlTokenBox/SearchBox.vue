<template>
  <div class="d-flex flex-row">
    <input type="text"
           class="search-input"
           :value="value"
           ref="searchInput"
           @keyup.stop.esc="clearInput"
           @click="$emit('click')"
           @input="updateValue($event.target.value)">

    <div class="button-wrapper">
      <button v-if="value"
              class="h-100"
              @click="clearInput">X
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: {
    value: {
      default: ""
    }
  },
  methods: {
    updateValue(val) {
      this.$emit('input', val);
    },
    clearInput() {
      this.updateValue("");

      this.$refs.searchInput.focus();
      this.$emit('clear');
    }
  },
  mounted() {
    this.clearInput();
  }
}
</script>

<style lang="scss" scoped>
.search-input {
  padding: 1em 0 1em 1em;
  height: 2em;
  margin: 0.5em 0;
  border-radius: 0.5em;
}

.button-wrapper {
  width: 2em;
}

button {
  border: none;
  background-color: inherit;
  color: #000;
}
</style>
