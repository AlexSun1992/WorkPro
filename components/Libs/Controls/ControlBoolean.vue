<template>
  <b-form-checkbox class="my-3" v-model="data.value" :disabled="!edit ? !edit : data.readonly">{{data.label}}</b-form-checkbox>
</template>

<script>
export default {
  name: 'ControlBoolean',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    }
  }
}
</script>

<style scoped>
 
</style>
