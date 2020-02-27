<template>
  <div>
      <birthday-form  v-model="data.birthday.$model" :state="state"/>
      <small v-show="state === false" class="text-danger">
        Пожалуйста, заполните это поле
      </small>
  </div>

</template>

<script>
  import BirthdayForm from './BirthdateForm'
  export default {
    name: 'BirthdayWrapper',
    components: {BirthdayForm},
    props: {
      data: Object,
      state: Boolean
    }
  }
</script>

<style scoped>

</style>
