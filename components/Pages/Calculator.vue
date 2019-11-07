<template>
  <div class="wrapper">
    <div class="animated fadeIn">
      <b-modal ref="auth-modal"  title="Авторизация" cancel-title="Отмена" @ok="login" no-fade>
        <div class="form-group">
          <label>Телефон</label>
          <input type="tel" class="form-control"  placeholder="Введите 10 цифр Вашего телефона">
        </div>
        <div class="form-group">
          <label>Пароль</label>
          <input type="password" class="form-control"  placeholder="Пароль">
        </div>
      </b-modal>
      <b-row>
        <b-col lg="12">
          {{isAuthenticated}}
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
                <div>
                  <b-button :disabled="isDisabledCalculate" v-on:click="calculate" type="submit" size="md" variant="primary">Рассчитать</b-button>
                  <b-button :disabled="isDisabledApply" type="submit" size="md" variant="primary">Оформить</b-button>
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
        form : {},
        calcId : null
      }
    },
    computed: {
      isDisabledCalculate () {
         return !this.form.a || !this.form.b
      },
      isDisabledApply () {
         return !this.calcId || !this.isAuthenticated
      },
      ...mapGetters(['isAuthenticated'])
    },
    methods: {
      async login() {
        try {
          var basicAuth = 'Basic ' + btoa('ionka' + ':' + '{mode:1, pass: "klop#7557"}')
          await this.$auth.loginWith('local', {
            headers: { 'Authorization': basicAuth }
          });
          this.calculate()
        } catch (e) {
          console.log(e)
        }
      },
      async calculate() {
        if(!this.isAuthenticated){
          this.$refs['auth-modal'].show()
        }
        else{
          this.calcId = 12345
          const data = await this.$axios.$get('/am/main/v2/userinfo').catch((e) => {
            if(e.response.status === 401){
              this.$auth.logout()
              this.$refs['auth-modal'].show()
            }
          })
        }
      }
    }
  }
</script>

<style scoped>

</style>
