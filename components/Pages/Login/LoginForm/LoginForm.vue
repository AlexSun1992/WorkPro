<template>
  <div>
    <div class="form-group">
      <label>Телефон / Email</label>
      <input v-model.lazy="user.username"  type="tel" :state="validation" class="form-control" placeholder="Введите 10 цифр Вашего телефона или email">
    </div>
    <b-form-invalid-feedback :state="validation">
        Пожалуйста, введите корректный номер телефона или email
    </b-form-invalid-feedback>
    <div class="form-group">
      <label>Пароль</label>
      <input v-model="user.password" type="password" class="form-control"  placeholder="Пароль">
    </div>
    <b-button variant="success" @click.prevent="login">Авторизоваться</b-button>
  </div>
</template>

<script lang="ts">

import { Vue, Component } from 'vue-property-decorator';
import { IUser } from '../login.types';

  @Component({
    name: 'LoginForm',
  })
  export default class LoginForm extends Vue {

    user = <IUser>{};
    errorMessage = null;
    captcha = null;

    async login() {
      try {
        if (!this.validation) return;
        // this.captcha = await (this as any).$getCaptcha();
        await ((this as any).$auth as any).loginWith('local', {
          headers: {},
          data: <IUser> {
            username: this.user.username,
            password: this.user.password,
            mode: 2,
            captcha: this.captcha
          }
        });
        this.$router.push('/')
        this.errorMessage = null;
      } catch (e) {
        console.log(e)
      }
    }

    get validation() {
      if (this.user['username']) {
        const emailPattern = /^\w{2,}@\w{2,}\.\w{2,4}$/; 
        const mobilePattern = /^[0-9]{10}$/; 
        return (this.user.username as string).match(emailPattern) || (this.user.username as string).match(mobilePattern) ? true : false;
      }
    }
  }
</script>

<style scoped>

</style>
