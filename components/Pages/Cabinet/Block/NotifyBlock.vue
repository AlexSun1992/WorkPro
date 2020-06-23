<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
  import ContentBlock from './ContentBlock'
  import ActionButton from './ActionButton'
  import VRuntimeTemplate from "v-runtime-template";
  export default {
    name: 'NotifyBlock',
    components: {ContentBlock, VRuntimeTemplate, ActionButton},
    props: {
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
      }
    }
  }
</script>

<style scoped>

</style>
