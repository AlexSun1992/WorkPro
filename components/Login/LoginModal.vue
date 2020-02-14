<template>
  <b-modal ref="auth-modal"  title="Авторизация" cancel-title="Отмена" @ok="login" no-fade>
    <b-alert :show="errorMessage" variant="danger">{{errorMessage}}</b-alert>
    <div class="form-group">
      <label>Телефон</label>
      <input v-model="user.login"  type="tel" class="form-control"  placeholder="Введите 10 цифр Вашего телефона">
    </div>
    <div class="form-group">
      <label>Пароль</label>
      <input v-model="user.password" type="password" class="form-control"  placeholder="Пароль">
    </div>
    <b-button variant="link">Зарегистрироваться</b-button>
  </b-modal>
</template>

<script>
  export default {
    name: 'LoginModal',
    props: {
      onAuth: {
        type: Function,
        default: () => 1
      }
    },
    data () {
      return {
        user: {},
        errorMessage: null
      }
    },
    methods: {
      async login(e) {
        try {
          e.preventDefault();
          this.errorMessage = null;
          let password = encodeURI(this.user.login) + ':' + `{mode:2, pass: "${encodeURI(this.user.password)}"}`
          var basicAuth = 'Basic ' + btoa(password)
          await this.$auth.loginWith('local', {
            headers: { 'Authorization': basicAuth }
          });
          this.$refs['auth-modal'].hide()
          if(typeof(this.onAuth()) === 'function') this.onAuth()
        } catch (e) {
          if(e.response.status === 401){
            this.errorMessage = e.response.data.MESSAGE
          }
          console.log(e.response.status)
          console.log(e.response.data)
        }
      },
      showLoginModal () {
        this.$refs['auth-modal'].show()
      }
    }
  }
</script>

<style scoped>

</style>
