<template>
  <div>
    <slot :content="wizardData" :actions="actions"></slot>
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
  created() {
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
    }
  }
};
</script>