<template>
    <b-button v-on:click="startAction()">
      <slot></slot>
    </b-button>
</template>

<script>
  export default {
    name: 'ActionButton',
    props: {
      actionId: {
        type: Number,
        required: true,
        default: () => null
      },
      itemId: {
        type: Number,
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
        console.log(this.actionData)
        // try {
        //   await this.$store.dispatch('blocks/executeAction', {actionId:this.actionId, rowId:this.rowId});
        // } catch(err) {
        //   this.$bvToast.toast(err.response.data.MESSAGE, {
        //     title: `Ошибка`,
        //     variant: 'danger',
        //     noAutoHide: true,
        //     solid: true
        //   })
        // }
      },
    },
    computed: {
      actionData: {
        get: function () {
          return this.$store.getters['menu/getMenuById'](this.itemId).ACTIONSCUR
        }
      }
    }
  }
</script>

<style scoped>

</style>
