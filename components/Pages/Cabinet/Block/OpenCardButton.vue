<template>
  <button
    :id="itemId"
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
      default: () => null,
    },
    menuId: {
      type: String,
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    relId: {
      type: String,
      default: () => null,
    },
  },
  computed: {
    parentMenu: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.menuId).NPARENTMENU;
      },
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
};
</script>

<style scoped>
.dropdown-menu {
  min-width: fit-content;
}
</style>
