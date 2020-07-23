<template>
  <div class="wrapper">
    <b-card v-if="getFormData">
      <h5>{{data.label}}</h5>
      <card-form :data="getFormData" :edit="editForm"></card-form>
    </b-card>
    <div>
      <b-button pill type="button" variant="success" @click="ok()">
        Сохранить
      </b-button>
      <b-button pill type="button" variant="outline-success" @click="cancel()">
        Отменить
      </b-button>
    </div>
  </div>
</template>

<script>
  import CardForm from '~/components/Pages/Cabinet/Profile/Card/CardForm'

  export default {
    name: 'Edit',
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
    },
    methods: {
      ok() {
        // Заменить кодом сохранения
        this.$emit('editClose');
      },
      cancel() {
        this.$emit('editClose');
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    width: 100%;
  }
</style>
