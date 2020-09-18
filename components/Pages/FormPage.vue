<template>
  <div>
    <div class="block-title pt-0 position-relative mt-2 mb-4">
      <i class="icon-my-profile"></i>{{ params.settings.text }}
    </div>
    
    <card-editor class="bg-six block-border-one block col p-4"  @saved="$emit('saved')" @error="$emit('error')" ref="profile-form" @field-changed="$emit('field-changed')" :data="dataForm" :edit="params.settings.edit" :params="params"></card-editor>
  </div>
</template>

<script>
  import CardEditor from '~/components/Libs/CardEditor/CardEditor'
  export default {
    name: 'FormPage',
    components: { CardEditor },
    props: ['params'],
    data() {
      return {
        list: null,
        card: null
      }
    },
    async created() {
      this.$store.dispatch('card/clearCaptions');
      this.$store.dispatch('card/updateWizard', []);
      this.list = await this.$axios.get(`/api/list/${this.params.page.idModule}/${this.params.page.idItem}/[]`);
      this.card = await this.$axios.get(`/api/card/${this.params.page.idModule}/${this.params.page.idItem}/${this.list.data.items[0].ID}`);
      let captions = this.card.data.metaData.captions.split(';')
      captions.pop();
      this.$store.commit('card/setWizardData', this.card.data.metaData.data);
      this.$store.commit('card/setWizardCaptions', captions);
    },
    computed: {
      dataForm() {
        return JSON.parse(JSON.stringify(this.$store.getters['card/wizardData']))
      }
    }

    // commit('setWizardCaptions', captions);
    // commit('setWizardData', card.data.metaData.data);
  }
</script>

<style scoped>

</style>
