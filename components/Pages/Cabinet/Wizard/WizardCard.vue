<template>
  <div>
    <b-card>
      <b-button v-on:click="destroyForm" type="submit" variant="primary" v-b-popover.hover.top="'Назад'"><i  class="fa fa-chevron-left"></i></b-button>
      <Form   :data="formData" :edit="editForm"></Form>
    </b-card>
  </div>
</template>

<script>
  import Form from '~/components/Libs/Form/Form'
  export default {
    name: 'WizardList',
    components: {Form},
    data () {
      return {
        editForm: false
      }
    },
    methods: {
      destroyForm () {
        this.$store.dispatch('blocks/destroyForm');
      },
    },
    computed: {
      formData: {
        get: function () {
          return JSON.parse(JSON.stringify(this.$store.getters['blocks/getForm']));
        }
      }
    }
  }
</script>

<style scoped>

</style>
