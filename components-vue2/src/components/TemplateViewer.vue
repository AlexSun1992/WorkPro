<template>
  <div>
    <v-runtime-template :template="templateData"></v-runtime-template>
  </div>
</template>

<script>
const ACCESS_TOKEN = "auth._token.local";
import ContentBlock from "./ContentBlock.vue";
import VRuntimeTemplate from "v-runtime-template";
import Cookies from "js-cookie";
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
        idRel: "0",
        zone: Cookies.get(ACCESS_TOKEN) != "false" ? "" : "free",
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
      let settings = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      if (Cookies.get(ACCESS_TOKEN) != "false") {
        this.template = settings.cardgrid;
      }
      if (!settings) {
        const flatmenu = this.$store.getters["menu/flatmenu"];
        const menuItem = flatmenu.find((item) => {
          return item.IDITEM == this.itemId;
        });
        this.template = menuItem.SVJCARDGRID;
      }
    },
  },
  computed: {
    templateData() {
      return this.template;
    },
    userInfo() {
      if (this.$store.getters["data_card/userInfo"]) {
        this.fetchTemplate();
      }
    },
  },
  watch: {
    userInfo() {
      console.log("userInfo");
    },
  },
};
</script>

<style scoped></style>
