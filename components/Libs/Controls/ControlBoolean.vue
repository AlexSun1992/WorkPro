<template>
  <b-form-checkbox class="my-3" @input="updateField" v-model="data.value" :disabled="!edit ? !edit : data.readonly">{{data.label}}</b-form-checkbox>
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
  },
  methods: {
    updateField(e){
      this.$emit('update', {fieldId:this.data.fieldId, isTab:this.data.isTab, value: String(e), page: this.data.page})
    }
  }
}
</script>

<style scoped>
 
</style>
