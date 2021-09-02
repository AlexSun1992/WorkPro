<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
import ContentBlock from "./ContentBlock.vue";
import VRuntimeTemplate from "v-runtime-template";
export default {
  name: "TemplateViewer",
  components: { ContentBlock, VRuntimeTemplate },
  props: {
    moduleId: {
      type: Number,
      required: true,
    },
    itemId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      params: {
        idItem: this.itemId,
        idModule: this.moduleId,
        idParent: "0",
        idCard: "0",
        zone: this.$store.getters["auth/getLogged"] ? "" : "free",
      },
      template: "",
    };
  },

  created() {
    this.fetchTemplate();
  },

  methods: {
    async fetchTemplate() {
      await this.$store.dispatch("menu/fetchMenu", this.params);
      if (this.$store.getters["auth/getLogged"]) {
        if (this.$store.getters["menu/breadcrumbs"]) {
          this.template = this.$store.getters["menu/breadcrumbs"]
            .slice(-1)
            .pop().cardgrid;
        }
      } else {
        this.template = this.getMenuItem().SVJCARDGRID;
      }
    },
    getMenuItem() {
      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find((item) => {
        return item.IDITEM == this.itemId;
      });
      return menuItem;
    },
  },
  computed: {
    templateData() {
      return this.template;
    },
  },
};
</script>

<style scoped></style>
