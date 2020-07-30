<template>
  <div class="wrapper">
    <b-tabs v-if="wizardData" content-class="mt-3">
      <div v-for="(item, i) in wizardData" :key="i">
        <b-tab v-if="item.data.length" :title="item.title">
          <profile-form @saved="$emit('saved')" @error="$emit('error')" ref="profile-form" @field-changed="$emit('field-changed')" :data="item.data" :edit="editForm" :params="params"></profile-form>
        </b-tab>
      </div>
    </b-tabs>
    <div class="my-3 d-flex d-flex justify-content-between" v-if="$store.getters['card/wizardData']">
      <div>
        <b-button pill v-on:click="saveProfile" type="button" variant="success">Сохранить изменения</b-button>
        <b-button pill v-on:click="cancel" type="button" variant="outline-success">Отменить</b-button>
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
      initialWizardData: null
    }
  },
  created() {
    this.$store.dispatch('card/setCard', this.params);
    this.fetchWizard();
  },
  computed: {
    wizardData() {
      return JSON.parse(JSON.stringify(this.$store.getters['card/wizardData']));
    }
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
      let valid = true
      for (let i = 0; i < data.length; i++) {
        let value = data[i].type === 'enum' ? data[i].value.value : data[i].value
        data[i].checked = true
        if (data[i].required && !value && data[i].type !== 'boolean') {
          data[i].state = false
          valid = false
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
    }
  }
};
</script>

<style scoped>
  .wrapper {
    width: 100%;
  }
</style>