<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
  import ContentBlock from './ContentBlock'
  import ActionButton from './ActionButton'
  import OpenCardButton from '../Block/OpenCardButton'
  import DeleteCardButton from '../Block/DeleteCardButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'NotifyBlock',
    components: {ContentBlock, VRuntimeTemplate, ActionButton, OpenCardButton, DeleteCardButton},
    props: {
      moduleId: {
        type: String,
        required: false,
        default: () => ''
      },
      itemId: {
        type: String,
        required: true,
        default: () => null
      },
      name: {
        type: String,
        required: true,
        default: () => null
      }
    },
    computed: {
      templateData: {
        get: function () {
          return this.$store.getters['menu/getMenuById'](this.itemId).SVJCARDGRID
        }
      },
      actions: {
        get: function () {
          return this.$store.getters['menu/getMenuById'](this.itemId).ACTIONSCUR
        }
      },
      isEmptyContent: {
        get: function () {
          let block =  this.$store.getters['blocks/getBlockById'](this.itemId)
          if(block){
            return !block.data.items.length
          }
          else{
            return false
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
