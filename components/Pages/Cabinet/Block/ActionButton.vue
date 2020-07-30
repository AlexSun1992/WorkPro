<template>
    <b-button v-if="action" v-on:click="startAction()">
      <slot><div v-text="action.SNAME"></div></slot>
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
      actionId: {
        type: String,
        required: true,
        default: () => null
      },
      rowId: {
        type: Number,
        required: false,
        default: () => 0
      },
      body: {
        type: Object,
        required: false
      }
    },
    methods: {
      async startAction () {
        try {
          if(this.action.NTYPE === 2){
            if(this.action.SCONST){
              this.$router.push(`/cabinet/55/0/${this.action.SCONST}`)
            }
          }
          else{
            await this.$store.dispatch('blocks/executeAction', {actionId:this.actionId, rowId:this.rowId, itemId:this.action.NITEM, body:this.body});
          }
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      },
    },
    computed: {
      action: {
        get: function () {
          const action = this.actions.find(a => a.ID === parseInt(this.actionId));
          return action ? action : null
        }
      }
    }
  }
</script>

<style scoped>

</style>
