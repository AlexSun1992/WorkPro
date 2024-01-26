<template>
  <div>
    <grid
      v-if="!templateGrid && !getSavedError && !getError"
      :load="load"
      :total="list.total"
      :fields="list.fields"
      :items="list.items"
    >
      <template v-slot:actions="slotProps">
        <button type="button" :disabled="true" class="btn btn-success">
          Открыть
        </button>
      </template>
    </grid>
    <div v-else>
      <v-runtime-template
        :template="templateGrid"
        :data="list"
        :params="settingsParams"
      ></v-runtime-template>
    </div>
    <b-alert
      :show="getSavedError || getError"
      variant="danger"
      class="mt-3 mb-0"
    >
      {{ getErrorMessage }}
    </b-alert>
  </div>
</template>

<script>
import Grid from "/../components/Libs/Table/Grid";
import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import VRuntimeTemplate from "v-runtime-template";
import ContentBlock from "./ContentBlock";
Vue.use(BootstrapVue);
const TOKEN_NAME = "auth._token.local";
export default {
  name: "List",
  components: {
    VRuntimeTemplate,
    ContentBlock,
    Grid,
  },
  props: {
    moduleId: {
      type: Number,
      required: true,
    },
    menuId: {
      type: Number,
      required: true,
    },
    zone: {
      type: String,
      required: false,
      default: "free",
    },
  },
  data() {
    return {
      list: {},
      loaded: false,
      load: false,
      params: {
        idItem: this.menuId,
        idModule: this.moduleId,
        idParent: "0",
        idCard: "0",
        idRel: "0",
        zone: this.zone,
      },
    };
  },
  async created() {
    try {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        this.$axios.defaults.headers.common["Authorization"] = token;
      }
      this.load = true;
      await this.$store.dispatch("menu/fetchMenu", this.params);
      this.list = await this.fetchCard();
    } catch (e) {
      this.$store.commit("data_card/setError", true);
      this.$store.commit(
        "data_card/setErrorMessage",
        e?.response?.data || { MESSAGE: "Ошибка отображения компонента" }
      );
    } finally {
      this.load = false;
    }
  },
  methods: {
    async fetchCard() {
      return await this.$store.dispatch("data_card/fetchList", this.params);
    },
  },
  computed: {
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getErrorMessage",
      "getSavedError",
      "getError",
      "getBtnSave",
      "getDataFieldByFieldId",
    ]),
    ...mapGetters("auth", ["getLogged", "getUser"]),
    templateGrid: function () {
      return this.$store.getters["menu/getMenuById"](this.menuId)?.SVJCARDGRID;
    },
    settingsParams: function () {
      return this.$store.getters["menu/settings"].slice(-1).pop();
    },
    name() {
      return this.settingsParams?.text;
    },
    itemId() {
      return this.menuId;
    },
  },
};
</script>

<style scoped></style>
