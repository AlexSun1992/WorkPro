<template>
  <b-form-group  :label="label">
    <b-form-textarea id="textarea1"
                     v-model="data.value"
                     :disabled="!edit"
                     :state="data.state"
                     placeholder="Введите текст"
                     :rows="3"
                     :max-rows="6">
    </b-form-textarea>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  name: 'ControlText',
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
      return `${this.data.label}${this.data.required ? '<span style="color:red">*</span>' : ''}`
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
