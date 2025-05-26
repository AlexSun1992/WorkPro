<template>
  <button
    type="button"
    class="btn btn-info"
    @click.stop="openCard()"
  >
    <slot>Открыть</slot>
  </button>
</template>

<script>
export default {
  name: "OpenCardButton",
  props: {
    itemId: {
      type: Number,
      required: false,
      default: () => null,
    },
    menuId: {
      required: true,
      default: () => "",
    },
    moduleId: {
      type: String,
      required: true,
      default: () => "",
    },
    relId: {
      type: String,
      required: false,
      default: () => null,
    },
  },
  methods: {
    openCard() {
      this.$store.commit("data_card/saveButtonClicked", false);
      this.$store.commit("data_card/setListPath", this.$route.fullPath);
      $nuxt._router.push(
        `/cabinet/${this.moduleId}/0/${this.parentMenu ? this.parentMenu : this.menuId}/${this.itemId}${
          this.relId ? `/${this.relId}` : ""
        }`
      );
    },
  },
  computed: {
    parentMenu: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.menuId).NPARENTMENU;
      },
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  min-width: fit-content;
}
</style>
