<template>
    <div>
      <b-form-input  v-model="data.birthday.$model" :state="state"/>
      <b-form-invalid-feedback>Пожалуйста, заполните это поле</b-form-invalid-feedback>
    </div>
</template>

<script>
  export default {
    name: 'CustomComponent',
    props: {
      data: Object,
      state: Boolean
    },
  }
</script>

<style scoped>

</style>
