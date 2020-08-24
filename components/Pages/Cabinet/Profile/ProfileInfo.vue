<template>
  <div class="wrapper">
    <b-tabs v-if="wizardData" content-class="mt-4">
      <div v-for="(item, i) in wizardData" :key="i">
        <b-tab :title="item.title" :active="isActive(i)">
          <profile-form @saved="$emit('saved')" @error="$emit('error')" ref="profile-form" @field-changed="$emit('field-changed')" :data="item.data" :edit="editForm" :params="params"></profile-form>
        </b-tab>
      </div>
    </b-tabs>
    <div class="mt-3 row" v-if="$store.getters['card/wizardData']">
      <div class="col-12">
        <b-button pill v-on:click="saveProfile" type="button" variant="success" class="col-12 col-md-auto">Сохранить изменения</b-button>
        <b-button pill v-on:click="cancel" type="button" variant="outline-success" class="col-12 col-md-auto mt-2 mt-md-0 ml-md-3">Отменить</b-button>
      </div>
      <!-- <action-button :actions="actions" :rowId="125" item-id="params.page.itemId" action-id="32904"/> -->
    </div>
  </div>
</template>

<script>

import ProfileForm from '~/components/Pages/Cabinet/Profile/ProfileForm'
import ActionButton from '~/components/Pages/Cabinet/Block/ActionButton'
export default {
  name: "ProfileInfo",
  components: { ActionButton, ProfileForm },
  props: ['params'],
  data() {
    return {
      editForm: true,
      initialWizardData: null,
      invalidFields: [],
      wizardData: null
    }
  },
  async fetch () {
    await this.fetchWizard();
    this.wizardData = JSON.parse(JSON.stringify(this.$store.getters['card/wizardData']));
  },
  created() {
    this.$store.dispatch('card/setCard', this.params);
  },
  methods: {
    async fetchWizard() {
      const params = {
        id: this.$store.state.auth.user[0]._data[0].ID,
        wizard: null
      };
      await this.$store.dispatch("card/fetchWizard", params);
      this.$emit('load');
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
      let fields = [];
      let profileForm = this.$refs['profile-form'];
      profileForm.forEach(item => {
        fields.push(...item.$refs.form.items);
        fields = fields.filter(item => item.name !== 'SEMPTY');
      });
      if(this.validateData(fields)){
        try {
          await this.$store.dispatch('card/saveProfile', fields);
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
    }
  }
};
</script>

<style scoped>
  .wrapper {
    width: 100%;
  }
</style>