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
                <div slot="footer">
                  <b-button :disabled="isDisabledCalculate" type="submit" size="md" variant="primary">Рассчитать</b-button>
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
         return !this.calcId
      }
    }
  }
</script>

<style scoped>

</style>
