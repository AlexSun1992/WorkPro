<template>
  <div class="d-flex flex-row">
    <input type="text"
           class="search-input"
           :value="value"
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
    }
  }
}
</script>

<style lang="scss" scoped>
.search-input {

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
