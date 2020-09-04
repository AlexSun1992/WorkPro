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
        this.$store.commit('card/setWizardField',{fieldId:this.data.fieldId, isTab:this.data.isTab, value:value, page: this.data.page});
      }
    }
  }
}
</script>

<style scoped>
  /* .form-control:disabled, .form-control[readonly]{
    background-color: white;
  } */

  .required > legend:after {
    content: '*';
    color: red;
  }
</style>
