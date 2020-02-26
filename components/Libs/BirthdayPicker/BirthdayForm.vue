<template>
  <b-row>
    <b-col>
      <b-form-select v-model="date.day" :options="days" @change="updateInput()" :state="state"></b-form-select>
    </b-col>
    <div class="col">
      <b-form-select v-model="date.month" :options="months" @change="updateInput()" :state="state"></b-form-select>
    </div>
    <div class="col">
      <b-form-select v-model="date.year" :options="years" @change="updateInput()" :state="state"></b-form-select>
    </div>
  </b-row>
</template>

<script>
  import data from './data'
  function getDataString(date){
    if(date.day && date.month && date.year){
      return `${date.day}.${date.month}.${date.year}`
    }
    else{
      return null
    }
  }
  export default  {
    data () {
      return {
        date : {day: null, month: null, year: null},
        days: data.days(),
        months: data.month(),
        years: data.years(),
        focus: false
      }
    },
    props: ['value', 'state'],
    methods: {
      updateInput () {
        this.$emit('input', getDataString(this.date))
      }
    }
  }
</script>

<style scoped>

</style>
