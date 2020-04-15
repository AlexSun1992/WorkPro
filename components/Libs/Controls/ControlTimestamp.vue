<template>
  <b-form-group  :label="label">
    <date-picker v-model="data.value"  :disabled="!edit" type="datetime" format="DD.MM.YYYY HH:mm:ss" :first-day-of-week="1" :lang="lang" :input-class="data.state === false ? `${state} is-invalid` : state" ></date-picker>
    <div class="timestamp error" v-if="data.state === false">
      Обязательно для заполнения
    </div>
  </b-form-group>
</template>

<script>
import DatePicker from 'vue2-datepicker'
export default {
  name: 'ControlTimestamp',
  components: {DatePicker},
  data () {
    return {
      lang: 'ru',
      state: 'timestamp form-control'
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    }
  },
  computed: {
    label () {
      return `${this.data.label}${this.data.required ? '<span style="color:red">*</span>' : ''}`
    }
  }
}
</script>

<style>
  .timestamp.form-control:disabled, .form-control.disabled {
    opacity: 1;
    color: #000;
    background-color: white;
  }
  .timestamp.error{
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #f86c6b;
  }
</style>
