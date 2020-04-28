<template>
  <div v-html="data.value"></div>
</template>

<script>
  export default {
    name: 'ControlClob',
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
