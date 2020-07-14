<template>
  <div v-if="show">
    <slot :content="wizardData" :saveProfile="saveProfile" :cancel="cancel" :actions="actions"></slot>
  </div>
</template>

<script>
export default {
  name: "Profile",
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  data() {
    return {
      show: true
    }
  },
  created() {
    console.log('reloaded')
    this.$store.dispatch('card/setCard', this.params);
    this.fetchWizard();
  },
  computed: {
    wizardData() {
      return this.$store.getters["card/wizardData"];
    },
    actions: {
      get: function () {
        return this.$store.getters['menu/getMenuById'](this.params.page.idItem).ACTIONSCUR
      }
    }
  },
  methods: {
    async fetchWizard() {
      const params = {
        id: this.$store.state.auth.user[0]._data[0].ID,
        wizard: null
      };
      this.$store.dispatch("card/fetchWizard", params);
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
      return valid
    },
    saveProfile() {
      let fields = [];
      for (let i = 0; i < this.wizardData.length; i++) {
        fields.push(...this.$children[0].$children[i].$children[0].items);
      }
      if(this.validateData(fields)){
        try {
          this.$store.dispatch('card/saveProfile', fields);
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
    cancel() {
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      })
    }
  }
};
</script>