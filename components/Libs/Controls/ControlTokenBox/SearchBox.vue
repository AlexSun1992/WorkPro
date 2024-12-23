<template>
  <div>
    <input type="text"
           @input="updateValue">
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
    updateValue(ev) {
      this.$emit('input', ev.target.value);
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
