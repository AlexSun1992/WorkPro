<template>
  <b-row @input="updateInput">
    <b-col>
      <b-form-select v-model="date.day" :options="days"></b-form-select>
    </b-col>
    <div class="col">
      <b-form-select v-model="date.month" :options="months"></b-form-select>
    </div>
    <div class="col">
      <b-form-select v-model="date.year" :options="years"></b-form-select>
    </div>
  </b-row>
</template>

<script>
  import data from './data'

  export default  {
    data () {
      return {
        date : {day: null, month: null, year: null},
        days: data.days(),
        months: data.month(),
        years: data.years()
      }
    },
    prop: ['value'],
    methods: {
      updateInput () {
        this.$emit('input', this.date)
      }
    }
  }
</script>

<style scoped>

</style>
