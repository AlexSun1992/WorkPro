<template>
  <div>
      <!--<birthday-form  v-model="data.birthdate.$model" :state="state"/>-->
    <date-picker
      v-model="data.birthdate.$model"
      placeholder="Дата рождения"
      @blur="debouncedUpdate"
      @open="setPanelOpen"
      @close="setPanelClose"
      type="date"
      title-format="DD.MM.YYYY"
      format="DD.MM.YYYY"
      :lang="lang"
      :disabled-date="notBeforeDate"
      :default-value="defaultDate"
      :input-class="state === false ? `timestamp form-control is-invalid` : `timestamp form-control`">
    </date-picker>
      <small v-show="state === false" class="date-error text-danger">
        Пожалуйста, заполните это поле
      </small>
  </div>

</template>

<script>
  import BirthdayForm from './BirthdateForm'
  import DatePicker from 'vue2-datepicker';
  import _ from 'lodash'
  import 'vue2-datepicker/index.css';
  import 'vue2-datepicker/locale/ru';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  function getDate (value) {
    const date =  new Date;
    date.setFullYear(date.getFullYear() - value);
    return date;
  }
  export default {
    name: 'BirthdayWrapper',
    components: {BirthdayForm, DatePicker},
    props: {
      data: Object,
      state: Boolean
    },
    data () {
      return {
        lang: {
          formatLocale: {
            firstDayOfWeek: 1,
          },
          monthBeforeYear: false,
        },
        defaultDate: getDate (18),
        isOpenPanel: false
      }
    },
    created: function () {
      this.debouncedUpdate = _.debounce(this.blur, 100)
    },
    methods: {
      blur () {
        if(!this.isOpenPanel){
          this.data.birthdate.$touch()
        }
      },
      notBeforeDate(date) {
        return date > getDate (18);
      },
      setPanelOpen() {
        this.isOpenPanel = true
      },
      setPanelClose() {
        this.isOpenPanel = false
      }
    }
  }
</script>

<style scoped>
.mx-datepicker {
  width: 100%
}
</style>
