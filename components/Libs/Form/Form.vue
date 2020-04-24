<template>
  <div>
    <b-form-row>
      {{editDataForm}}
      <Control  v-for='(item, index) in items' :key='index' v-bind:data="item" v-bind:edit="edit" :cols="cols"></Control>
    </b-form-row>
  </div>
</template>
<script>
import Control from '~/components/Libs/Controls/Control'
export default {
  name: 'Form',
  components: {Control},
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    edit: {
      type: Boolean,
      required: true,
      default: () => false
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1
    }
  },
  data () {
    return {
      editDataForm: this.data
    }
  },
  watch: {
    'data': 'setData'
  },
  methods: {
    setData () {
      this.editDataForm = this.data
    },
    showList () {
      this.$emit('action-clicked', null)
    }
  },
  computed: {
    items: function () {
      return this.editDataForm.filter(function (item) {
        return item.visible
      })
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
