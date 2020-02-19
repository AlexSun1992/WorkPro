<template>
  <b-row>
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

<script lang="ts">
  import data from './data'
  import { Vue, Component, Prop } from 'vue-property-decorator'

  @Component({})
  export default class birthdayPickerComponent extends Vue {
    data () {
      return {
        date : {day: null, month: null, year: null},
        days: data.days(),
        months: data.month(),
        years: data.years()
      }
    }
  }
</script>

<style scoped>

</style>
