<template>
    <b-form-group   class="mb-0"  :label="label">
      <b-form-input v-model="data.value" :disabled="!edit" :required="data.required" :state="data.state"></b-form-input>
      <b-form-invalid-feedback>
        Обязательно для заполнения
      </b-form-invalid-feedback>
    </b-form-group>
</template>

<script>
export default {
  name: 'ControlString',
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
  },
  computed: {
    label () {
      return `${this.data.label}`
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
