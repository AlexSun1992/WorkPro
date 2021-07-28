<template>
  <div>123</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CardEditor",
  props: {
    moduleId: {
      type: Number,
      required: true,
    },
    menuId: {
      type: Number,
      required: true,
    },
    cardId: {
      type: Number,
      required: false,
    },
  },
  async created() {
    let params = {
      idItem: this.menuId,
      idModule: this.moduleId,
      idParent: "0",
      idCard: "0",
    };
    await this.$store.dispatch("fetchForm", params);
    // await this.$store.dispatch("fetchMenu", params);
    // this.setting = this.$store.getters["breadcrumbs"].slice(-1).pop();
  },
  // computed: {
  //   ...mapGetters(["getForm", "getMenu"]),
  // },
};
</script>

<style scoped></style>
