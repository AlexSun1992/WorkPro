<template>
  <!-- <b-form-group  :label="label"> -->
  <div>
    <b-form-group  :label="data.label" :class="{required: data.required}" :label-for="data.name" :label-cols="data.labelCols ? '' : 2" :label-class="data.labelCols">
      <date-picker v-model="data.value" @change="updateField" :disabled="!edit ? !edit : data.readonly" type="date" valueType="DD.MM.YYYY" format="DD.MM.YYYY" :first-day-of-week="1" :lang="lang" :input-class="data.state === false ? `${state} is-invalid` : state" ></date-picker>
      <div class="timestamp error" v-if="data.state === false">
        Обязательно для заполнения
      </div>
    </b-form-group>
  </div>
</template>

<script>
import DatePicker from 'vue2-datepicker'
import moment from 'moment/moment'
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
  methods: {
    updateField(e){
      this.$emit('update', {fieldId:this.data.fieldId, isTab:this.data.isTab, value: this.data.value, page: this.data.page})
    }
  }
}
</script>

<style>
  .timestamp.form-control:disabled, .form-control.disabled {
    opacity: 1;
    color: #000;
    /* background-color: white; */
  }
  .timestamp.error{
    width: 100%;
    margin-top: 0.25rem;
    font-size: 80%;
    color: #f86c6b;
  }

  .required > legend:after {
    content: '*';
    color: red;
  }
</style>
