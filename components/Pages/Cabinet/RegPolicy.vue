<template>
  <div class="wrapper">
    <div class="animated fadeIn">
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
                <b-form-group>
                  <label>Фамилия</label>
                  <b-form-input v-model="form.family" type="text"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <label>Имя</label>
                  <b-form-input v-model="form.name" type="text"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <label>Отчество</label>
                  <b-form-input v-model="form.thirdname" type="text"></b-form-input>
                </b-form-group>
                <b-form-group>
                  <label>Дата рождения</label>
                  <b-form-input v-model="form.birthdate" type="text"></b-form-input>
                </b-form-group>
                <div>
                  <b-button  type="submit" size="md" variant="primary">Оформить</b-button>
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
  export default {
    name: 'RegPolicy',
    async asyncData ({route, params, store}) {
      let user = store.state.auth.user[0]._data[0]
      return {
          user: store.state.auth.user[0]._data[0] ,
          form: {a : 1, b : 2,
          name: user['SFIRSTNAME'],
          family: user['SSECONDNAME'],
          thirdname: user['STHIRDNAME'],
          birthdate: user['DBIRTHDATE']
        },
        calcId : params.calcId
      }
    },
    data () {
      return {
        form : {},
      }
    }
  }
</script>

<style scoped>

</style>
