<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-modal ref="auth-modal"  title="Авторизация" cancel-title="Отмена" @ok="login" no-fade>
        <div class="form-group">
          <label>Телефон</label>
          <input v-model="user.login"  type="tel" class="form-control"  placeholder="Введите 10 цифр Вашего телефона">
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input v-model="user.password" type="password" class="form-control"  placeholder="Пароль">
        </div>
      </b-modal>
      <b-row>
        <b-col lg="12">
          <b-card>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label>A</label>
                  <b-form-input v-model="form.a" type="number"></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row>
              <b-col sm="12">
                <b-form-group>
                  <label>B</label>
                  <b-form-input v-model="form.b" type="number"></b-form-input>
                </b-form-group>
                <b-form-group v-show="result">
                  <label>Результат</label>
                  <b-form-input v-model="result" disabled  type="number"></b-form-input>
                </b-form-group>
                <div>
                  <b-button :disabled="isDisabledCalculate" v-on:click="calculate" type="submit" size="md" variant="primary">Рассчитать</b-button>
                  <b-button :disabled="isDisabledApply" v-on:click="regPolicy" type="submit" size="md" variant="primary">Оформить</b-button>
                </div>
              </b-col>
            </b-row>
          </b-card>
        </b-col>
      </b-row>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  export default {
    name: 'Calculator',
    head: {
      title: 'Калькулятор'
    },
    data () {
      return {
        user: {},
        form : {},
        calcId : null,
        result: null
      }
    },
    computed: {
      isDisabledCalculate () {
         return !this.form.a || !this.form.b
      },
      isDisabledApply () {
         return !this.calcId
      },
      ...mapGetters(['isAuthenticated'])
    },
    methods: {
      async login() {
        try {
          let password = this.user.login + ':' + `{mode:2, pass: "${this.user.password}"}`
          var basicAuth = 'Basic ' + btoa(password)
          await this.$auth.loginWith('local', {
            headers: { 'Authorization': basicAuth }
          });
          this.regPolicy()
        } catch (e) {
          console.log(e)
        }
      },
      async calculate() {
        let min = Math.ceil(5000);
        let max = Math.floor(1000);
        this.calcId =  Math.floor(Math.random() * (max - min)) + min
        this.result =  Number(this.form.a) +  Number(this.form.b)
      },
      regPolicy() {
        if(!this.isAuthenticated){
          this.$refs['auth-modal'].show()
        }
        else{
          this.$router.push(`/cabinet/reg-policy/${this.calcId}`)
        }
      }
    }
  }
</script>

<style scoped>

</style>
