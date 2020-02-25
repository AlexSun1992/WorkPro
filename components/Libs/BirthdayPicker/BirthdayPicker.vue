<template>
  <div>
      <birthday-form  v-model="data.birthday.$model"/>
      <small v-show="state === false && data.$touch" class="text-danger">
        Пожалуйста, заполните это поле
      </small>
  </div>

</template>

<script>
  import BirthdayForm from './BirthdayForm'
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
