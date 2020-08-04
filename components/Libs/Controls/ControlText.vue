<template>
  <b-form-group  :label="label" :label-cols="data.labelCols ? data.labelCols : 2">
    <b-form-textarea id="textarea1"
                     v-model="data.value"
                     :disabled="!edit ? !edit : data.readonly"
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
      return this.data.label
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
