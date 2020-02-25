<template>
  <div class="form pt-6">
    <form-wrapper :validator="$v.form">
      <form-summary/>
      <form @submit.prevent="submit" novalidate>
        <form-group name="name">
          <input type="text" v-model="form.name">
        </form-group>
        <form-group name="email">
          <input type="email" v-model="form.email">
        </form-group>
        <div class="text-center">
          <button type="submit" class="button">
            Submit
          </button>
        </div>
      </form>
    </form-wrapper>
  </div>
</template>

<script>
  import { required, email } from 'vuelidate/lib/validators'

  export default {
    data () {
      return {
        form: {
          name: '',
          email: ''
        },
        localMessages: {
          email: '{attribute} is not a proper email, you should check it again.'
        }
      }
    },
    validations: {
      form: {
        name: {required},
        email: {required, email}
      }
    }
  }
</script>

<style scoped>

</style>
