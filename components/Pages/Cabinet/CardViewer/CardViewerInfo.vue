<template>
  <div>
    <card-editor  @saved="$emit('saved')" @error="$emit('error')" ref="profile-form" @field-changed="$emit('field-changed')" :data="wizardData" :edit="params.settings.edit" :params="params" :context="context"></card-editor>
    <div class="mt-3 row button-container" v-if="$store.getters['card/wizardData']">
      <div v-if="params.settings.edit"  class="col-12">
        <b-button pill v-on:click="saveProfile" type="button" variant="success" class="col-12 col-md-auto mr-4">Сохранить</b-button>
        <b-button pill v-on:click="cancel" type="button" variant="outline-success" class="col-12 col-md-auto mt-2 mt-md-0">Отменить</b-button>
      </div>
    </div>
  </div>
</template>

<script>

import CardEditor from '~/components/Libs/CardEditor/CardEditor'
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
export default {
  name: "CardViewerInfo",
  components: { ActionButton, CardEditor },
  props: ['params', 'edit', 'context'],
  data() {
    return {
      editForm: true,
      initialWizardData: null,
      invalidFields: [],
      //wizardData: null
    }
  },
  async fetch () {
    await this.fetchWizard();
    //this.wizardData = JSON.parse(JSON.stringify(this.$store.getters['card/wizardData']));
  },
  created() {
    this.$store.dispatch('card/setCard', this.params);
  },
  methods: {
    async fetchWizard() {
      let params;
      let blockId = this.$store.getters['blocks/blockId'];
      let cardId = this.$store.getters['blocks/cardId'];
      if (this.context == 'profile') {
        params = {
          id: this.$store.state.auth.user[0]._data[0].ID,
          wizard: null,
          context: this.context
        };
      } else {
        params = {
          blockId,
          cardId
        };
      }
      await this.$store.dispatch("card/fetchWizard", params);
      // this.$store.commit('card/setCardId', cardId)
      this.$emit('load');
    },
    destroyForm () {
      this.$store.dispatch('blocks/destroyForm');
      this.$store.dispatch('card/updateWizard', []);
      this.$store.commit('card/setShowWizard', false);
    },
    validateData(data) {
      this.invalidFields.length = 0;
      let valid = true
      for (let i = 0; i < data.length; i++) {
        let value = data[i].type === 'enum' ? data[i].value.value : data[i].value
        data[i].checked = true
        if (data[i].required && !value && data[i].type !== 'boolean') {
          data[i].state = false;
          valid = false;
          this.invalidFields.push(data[i]);
        }
      }
      return valid;
    },
    async saveProfile() {
      let blockId = this.$store.getters['blocks/blockId'];
      let cardId = this.$store.getters['blocks/cardId'];
      let fields = [];
      let profileForm = this.$refs['profile-form'];
      if (profileForm.$refs) {
        fields = this.$store.getters["card/wizardData"].filter(item => !item.name.match(/^ID/));
      } else {
        profileForm.forEach(item => {
          fields.push(...item.$refs.form.items);
          fields = fields.filter(item => item.name !== 'SEMPTY');
        });
      }
      if(this.validateData(fields)){
        // Убрать ошибку vuex this.validateData(fields)!
        try {
          if(this.context == 'profile'){
            await this.$store.dispatch('card/saveProfile', {fields, context: this.context, blockId, cardId: this.$store.getters['blocks/cardId']});
            await this.$store.dispatch('updateUser');
          }
          else{
            await this.$store.dispatch('blocks/saveForm', {moduleId:55, form: fields});
            this.$store.commit('card/setFormChanged', false)
          }
          this.$bvToast.toast('Успешно сохранено', {
            title: ``,
            variant: 'success',
            solid: true
          })
        } catch(err) {
          this.$bvToast.toast(err.response.data.MESSAGE, {
            title: `Ошибка`,
            variant: 'danger',
            noAutoHide: true,
            solid: true
          })
        }
      }
    },
    cancel(e) {
      this.$emit('cancel');
    },
    isActive(i) {
      if(this.invalidFields.length) {
        return this.invalidFields[0].page == i;
      }
    },
  },
  computed: {
    wizardData: {
      get: function () {
        return JSON.parse(JSON.stringify(this.$store.getters['card/wizardData']))
      }
    },
    isShowWizard: {
      get: function () {
        return this.$store.getters['card/isWizard']
      }
    },
  }
};
</script>

<style scoped>

</style>
