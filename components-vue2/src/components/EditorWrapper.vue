<template>
  <div>EditorWrapper</div>
</template>

<script>
export default {
  props: ["moduleId", "menuId"],
  data() {
    return {
      params: null,
      setting: null,
    };
  },

  async created() {
    this.params = {
      idItem: this.menuId,
      idModule: this.moduleId,
      idParent: "0",
      idCard: "0",
    };
    await this.$store.dispatch("fetchForm", this.params);
    //await this.$store.dispatch("fetchMenu", this.params);
    this.setting = this.$store.getters["breadcrumbs"].slice(-1).pop();
  },

  methods: {
    saveDataCard() {
      this.$store.dispatch("saveDataCard", {
        moduleId: this.moduleId,
        itemId: this.menuId,
        cardId: this.params.idCard,
        relId: null,
        form: this.$store.getters["getForm"],
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
