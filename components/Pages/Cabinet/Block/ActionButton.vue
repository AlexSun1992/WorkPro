<template>
    <b-button v-on:click="startAction()">
      <slot></slot>
    </b-button>
</template>

<script>
  export default {
    name: 'ActionButton',
    props: {
      actions: {
        type: Array,
        required: true,
        default: () => []
      },
      itemId: {
        type: String,
        required: true,
        default: () => null
      },
      actionId: {
        type: String,
        required: true,
        default: () => null
      },
      rowId: {
        type: Number,
        required: false,
        default: () => 0
      }
    },
    methods: {
      async startAction () {
        try {
          await this.$store.dispatch('blocks/executeAction', {actionId:this.actionId, rowId:this.rowId, itemId:this.itemId});
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      },
    }
  }
</script>

<style scoped>

</style>
