<template>
  <div>
    <div class="flex-row align-items-center">
      <div class="container">
        <b-row class="justify-content-center">
          <b-col md="6" lg="6">
            <b-tabs content-class="mt-3">
              <b-tab title="Вход" active>
                <login-form/>
              </b-tab>
              <b-tab title="Регистрация">
                <!--<reg-form/>-->
                <!--<test-form/>-->
               <reg-form-validate/>
              </b-tab>
            </b-tabs>
          </b-col>
        </b-row>
      </div>
    </div>
  </div>
</template>

<script>

  import LoginForm from './LoginForm/LoginForm'
  import RegForm from './RegForm/RegFormTS'
  import RegFormValidate from './RegForm/RegFormValidate'
  import TestForm from './RegForm/TestForm'

  export default {
    name: 'LoginPage',
    components: {RegForm, LoginForm, RegFormValidate, TestForm}
  }
</script>

<style scoped>

</style>
