<template>
    <b-form-group   class="form-inline" label="">
      <b-form-checkbox v-model="data.value" :disabled="!edit">{{data.label}}</b-form-checkbox>
    </b-form-group>
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
