<template>
  <div>
    <span>{{ data.value }}</span>
  </div>
</template>

<script>
  export default {
    name: 'ControlLabel',
    props: {
      data: {
        type: Object,
        required: true,
        default: () => {}
      }
    }
  }
</script>

<style scoped>

</style>
