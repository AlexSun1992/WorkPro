<template>
  <div>
    <b-form-row>
      <!-- {{items}} -->
      <!-- {{items}} -->
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
  computed: {
    items: function () {
      return this.data.filter(function (item) {
        return item.visible
      })
      // Оставил для теста 
      // (Необходимые поля для отображения JSONWEBFIELDS удаляются в form.js стр. 104 
      // if (data[i].name.substring(0, 2) === `FK`) {...})

      // return this.data;
    }
  }
}
</script>

<style scoped>
  .form-control:disabled, .form-control[readonly]{
    background-color: white;
  }
</style>
