<template>
  <b-modal ref="auth-modal"  title="Авторизация" cancel-title="Отмена" @ok="login" no-fade>
    <b-alert :show="errorMessage" variant="danger">{{errorMessage}}</b-alert>
    <div class="form-group">
      <label>Телефон / Email</label>
      <input v-model="user.login"  type="tel" :state="validation" class="form-control" placeholder="Введите 10 цифр Вашего телефона или email">
    </div>
    <b-form-invalid-feedback :state="validation">
        Пожалуйста, введите корректный номер телефона или email
    </b-form-invalid-feedback>
    <div class="form-group">
      <label>Пароль</label>
      <input v-model="user.password" type="password" class="form-control"  placeholder="Пароль">
    </div>
  </b-modal>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import { IUser } from './login.types';

  @Component({
    name: 'LoginModal'
  })
  export default class LoginModal extends Vue {

    user = <IUser>{};
    errorMessage = null;

    async login(e) {
      try {
        e.preventDefault();
        if (!this.validation) return;
        await ((this as any).$auth as any).loginWith('local', {
          headers: {},
          data: <IUser> {
            login: this.user.login,
            user_type: 'admin',
            password: (this.user as any).password,
            recaptcha_token: ''
          }
        });
        (this.$refs['auth-modal'] as any).hide();
        this.errorMessage = null;
      } catch (e) {
        if ((this as any).$auth.error.response.status === 401){
          this.errorMessage = (this as any).$auth.error.response.data;
        }
      }
    }
    showLoginModal () {
      (this.$refs['auth-modal'] as any).show()
    }
    get validation() {
      if ((this.user as any).login) {
        const emailPattern = /^\w{2,}@\w{2,}\.\w{2,4}$/; 
        const mobilePattern = /^[0-9]{10}$/; 
        return (this.user.login as string).match(emailPattern) || (this.user.login as string).match(mobilePattern) ? true : false;
      }
    }
  }
</script>

<style scoped>

</style>