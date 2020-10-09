<template>
  <b-button  v-on:click="openCard()">
    <slot>Открыть</slot>
  </b-button>
</template>

<script>
export default {
  name: 'OpenCardButton',
  props: {
    itemId: {
      type: Number,
      required: false,
      default: () => null
    },
    menuId: {
      required: true,
      default: () => ''
    },
    moduleId: {
      type: String,
      required: true,
      default: () => ''
    }
  },
  methods: {
    openCard () {
      $nuxt._router.push(`/cabinet/${this.moduleId}/0/${this.menuId}/${this.itemId}`)
    }
  }
}
</script>

<style scoped>

</style>
