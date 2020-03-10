<template>
  <div>
    <b-input  v-mask="dateMask" @blur="debouncedUpdate()"  :placeholder="placeholder" v-model="date" :state="state" autocomplete="off"></b-input>
  </div>

</template>

<script>
  import moment from 'moment/moment'
  import _ from 'lodash'

  export default {
    name: 'BirthdateInput',
    data () {
      return {
        dateMask: '##.##.####',
        placeholder: '__.__.__',
        date: ''
      }
    },
    created: function () {
      this.debouncedUpdate = _.debounce(this.updateInput, 100)
    },
    props: {
      state: Boolean,
      blur: Function
    },
    methods: {
      updateInput () {
        this.$emit('input', moment(this.date, 'DD.MM.YYYY').toDate())
        this.blur()
      },
      setDate (date) {
        this.date = moment(date).format('DD.MM.YYYY')
      }
    },
    watch: {
      date: function (val) {
        if (moment(val, 'DD.MM.YYYY', true).isValid()) {
          this.updateInput()
        }
      }
    }
  }
</script>

<style scoped>

</style>
