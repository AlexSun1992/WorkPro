<template>
  <div>
    <b-card v-if="getFormData">
      <card-viewer-form :data="getFormData" :edit="editForm" @update="$emit('update', $event)"></card-viewer-form>
    </b-card>
  </div>
</template>

<script>
  import CardViewerForm from '~/components/Pages/Cabinet/CardViewer/CardViewerForm'

  export default {
    name: 'Card',
    components: {CardViewerForm},
    props: ['data'],
    data () {
      return {
        editForm: true
      }
    },
    async created() {
      this.$store.dispatch('card/clearCardForm');
      let cardId = this.data.name.split('Card')[1];
      await this.$store.dispatch('card/fetchCardForm', cardId);
      if (this.$store.getters['menu/flatmenu'].length) {
        let menu = this.$store.getters['menu/flatmenu'].find(item => item.IDITEM == cardId);
        this.$emit('actions', menu.ACTIONSCUR);
      }
    },
    computed: {
      getFormData() {
        return JSON.parse(JSON.stringify(this.$store.getters['card/cardForm']));
      }
    }
  }
</script>

<style scoped>
  
</style>
