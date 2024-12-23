<template>
  <div>
    <input type="text"
           @input="$emit('input', $event)">
  </div>
</template>

<script>
export default {
  name: "SearchBox",
  props: {
    value: {
      default: ""
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
