<template>
  <div>
    <b-card v-if="getFormData">
      <modal-form :data="getFormData" :edit="editForm"></modal-form>
    </b-card>
  </div>
</template>

<script>
  import ModalForm from '~/components/Pages/Cabinet/Profile/Modal/ModalForm'

  export default {
    name: 'Modal',
    components: {ModalForm},
    props: ['data'],
    data () {
      return {
        editForm: true
      }
    },
    async created() {
      this.$store.dispatch('card/clearModalForm');
      let cardId = this.data.name.split('Card')[1];
      await this.$store.dispatch('card/fetchModalForm', cardId);
    },
    computed: {
      getFormData() {
        return JSON.parse(JSON.stringify(this.$store.getters['card/modalForm']));
      }
    }
  }
</script>

<style scoped>
  
</style>
