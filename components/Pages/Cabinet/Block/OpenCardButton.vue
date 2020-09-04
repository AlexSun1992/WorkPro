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
      async openCard () {
        try {
          await this.$store.dispatch('blocks/fetchForm', {moduleId:this.moduleId, menuId:this.menuId, itemId:this.itemId});
          this.$store.commit('card/setShowWizard', false);
          this.$store.dispatch('card/updateWizard', []);
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
  }
</script>

<style scoped>

</style>
