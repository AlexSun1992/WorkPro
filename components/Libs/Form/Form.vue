<template>
  <div>
    <b-form-row>
      <div>
        <!-- {{ defaultPlug }} -->
      </div>
      <Control  v-for='(item, index) in items' @edit="$emit('edit', $event)" @update="$emit('update', $event)" :key='index' v-bind:data="item" :edit="edit" :cols="cols"></Control>
    </b-form-row>
  </div>
</template>
<script>
import Control from '~/components/Libs/Controls/Control'
export default {
  name: 'Form',
  components: {Control},
  data() {
    return {
      counter: 0
    }
  },
  props: {
    data: {
      type: Array | null,
      required: true
    },
    edit: {
      type: Boolean,
      required: true
    },
    cols: {
      type: Number,
      required: false,
      default: () => 1
    }
  },
  computed: {
    items: function () {
      if (this.data) {
        return this.data.filter(item => {
          if ((!item.value || Object.keys(item.value).length == 0) && !this.edit) this.counter++;
          if (!item.visible) return; 
          return this.edit || !this.edit && item.value;
        })
      }
    },
    defaultPlug: function() {
      if (this.counter == this.data.length) {
          return 'Нет данных для отображения'
        }
    }
  }
}
</script>

<style scoped>
  /* .form-control:disabled, .form-control[readonly]{
    background-color: white;
  } */
</style>
