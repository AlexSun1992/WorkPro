<template>
  <div>
    <b-button v-if="!data.name.startsWith('Item')" class="button" variant="secondary">{{ data.label }}</b-button>
    <action-button v-if="actions" :body="body" :actions="actions" item-id="actions.NITEM" action-id="33223"/>
  </div>
</template>

<script>
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
export default {
  name: 'ControlButton',
  components: {ActionButton},
  data() {
    return {
      editShow: false,
      body: null
    }
  },
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    },
    currentField: {
      required: false
    }
  },
  computed: {
    actions: {
      get: function () {
        this.body = {
          "sNumber":  this.currentField?.value
        }
        return this.$store.getters['menu/getMenuById'](this.$route.params.idItem).ACTIONSCUR
      }
    }
  }
}
</script>

<style scoped>
 
</style>
