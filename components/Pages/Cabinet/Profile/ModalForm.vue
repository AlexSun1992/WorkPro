<template>
  <div>
    <b-card v-if="getFormData">
      <Form :data="getFormData" @modal="openModal($event)" :edit="editForm"></Form>
    </b-card>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'

  export default {
    name: 'ModalForm',
    components: {Form},
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
        return this.$store.getters['card/modalForm'];
      }
    }
  }
</script>

<style scoped>
  
</style>
