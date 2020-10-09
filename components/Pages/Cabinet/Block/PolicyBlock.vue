<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
import ContentBlock from './ContentBlock'
import OpenCardButton from '../Block/OpenCardButton'
import VRuntimeTemplate from 'v-runtime-template'
export default {
  name: 'PolicyBlock',
  components: { ContentBlock, VRuntimeTemplate, OpenCardButton },
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
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters['blocks/getBlockById'](this.itemId)
        if (block) {
          return !block.data.items.length
        } else {
          return false
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
