<template>
    <b-button v-if="action" @click="$emit('update', action)" class="button" variant="secondary">{{ action.SNAME }}</b-button>
</template>

<script>
export default {
  name: 'ControlButton',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    action: {
      get: function () {
        let contractId = this.data.name.split("Item")[1]
        let actions = this.$store.getters['menu/getMenuById'](this.$route.params.idItem).ACTIONSCUR
        return actions.find(item => item.ID == contractId)
      }
    }
  }
}
</script>
