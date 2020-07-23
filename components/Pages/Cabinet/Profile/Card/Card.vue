<template>
  <div>
    <b-card v-if="getFormData">
      <card-form :data="getFormData" :edit="editForm"></card-form>
    </b-card>
  </div>
</template>

<script>
  import CardForm from '~/components/Pages/Cabinet/Profile/Card/CardForm'

  export default {
    name: 'Card',
    components: {CardForm},
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
