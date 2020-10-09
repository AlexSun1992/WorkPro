<template>
  <b-form-group  :label="data.label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols ? '' : 2" :label-class="data.labelCols">
    <b-form-input v-model="fieldValue" :disabled="!edit ? !edit : data.readonly" :type="'number'" :state="data.state"></b-form-input>
    <b-form-invalid-feedback>
      Обязательно для заполнения
    </b-form-invalid-feedback>
  </b-form-group>
</template>

<script>
export default {
  name: 'ControlDouble',
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
    fieldValue: {
      get: function () {
        return this.data.value
      },
      set: function (value) {
        this.$emit('update', { fieldId: this.data.fieldId, value: Number(value) })
      }
    }
  }
}
</script>

<style scoped>
  .required > legend:after {
    content: '*';
    color: red;
  }
</style>
