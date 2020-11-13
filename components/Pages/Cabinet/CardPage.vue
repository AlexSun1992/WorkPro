<template>
  <div>
    <div
      v-if="cardCaption"
      class="block-title pt-0 position-relative mt-2 mb-4"
      :class="{ 'pl-0': $route.path.includes('/55/0/19') }"
    >
      <i class="icon-my-profile" v-if="!$route.path.includes('/55/0/19')"></i
      >{{ cardCaption }}
    </div>
    <b-modal
      v-if="!isError && settings.isModal"
      :modal-class="myclass"
      @close="closeModal"
      id="modal"
      no-close-on-backdrop
      hide-footer
    >
      <div class="block-title pt-0 position-relative mt-2 mb-4">
        <i class="icon-my-profile"></i>{{ settings.text }}
      </div>
      <CardEditor
        v-if="editable || (!settings.cardtemplate && !editable)"
        class="bg-six block-border-one block col p-4"
        :data="getFormData"
        :edit="editable"
        :params="settings"
      />
      <v-runtime-template
        v-if="settings.cardtemplate"
        :template="settings.cardtemplate"
      ></v-runtime-template>
    </b-modal>
    <div class="profile row">
      <div
        class="col"
        v-if="editable || (!settings.cardtemplate && !editable && !isError)"
      >
        <CardEditor
          class="bg-six block-border-one block p-4 pt-5"
          :data="getFormData"
          :edit="editable"
          :params="settings"
        />
      </div>
      <v-runtime-template
        v-if="!isError && settings.cardtemplate"
        :template="settings.cardtemplate"
      ></v-runtime-template>
      <div v-else-if="isError">
        {{ errorMessage.INFO ? errorMessage.INFO : errorMessage.MESSAGE }}
      </div>
    </div>
  </div>
</template>

<script>
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import VRuntimeTemplate from "v-runtime-template";
import { isFieldExists, getField, getFieldValue } from "~/utils/utils.js";
import { saveAs } from "file-saver";

export default {
  name: "CardPage",
  components: { CardEditor, VRuntimeTemplate },
  async fetch({ store, route }) {
    await store.dispatch("data_card/fetchForm", route.params);
  },
  data() {
    return {
      editable: false,
      myclass: ["cabinet"],
    };
  },
  created() {
    this.edit();
  },
  mounted() {
    this.$bvModal.show("modal");
  },
  destroyed() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
  },
  methods: {
    // isFieldExists,
    // getField,
    // getFieldValue,
    closeModal() {
      this.$router.back();
    },
    isFieldExists(name, data = undefined) {
      return Boolean(this.getField(name, data));
    },
    getField(name, data = this.$store.getters["data_card/getForm"].data || []) {
      return data.find((item) => item.name === name);
    },
    getFieldValue(name, data = undefined) {
      return this.getField(name, data) ? this.getField(name, data).value : "";
    },
    edit() {
      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find((item) => {
        return item.IDITEM == this.$route.params.idItem;
      });
      this.editable = menuItem?.LEDIT;
    },
    saveFile(idReport, fileName, event) {
      if (event) {
        event.preventDefault();
      }
      this.$axios({
        url: `am/main/v2/report?idreport=${idreport}&id=${this.$route.params.idCard}`,
        method: "GET",
        responseType: "blob",
      }).then((response) => {
        saveAs(response.data, fileName);
      });
    },
  },
  computed: {
    getFormData() {
      const formData = JSON.parse(
        JSON.stringify(this.$store.getters["data_card/getForm"])
      );
      return formData.length ? formData : formData.data;
    },
    settings: {
      get: function () {
        return this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      },
    },
    cardCaption() {
      return this.$store.getters["data_card/cardCaption"];
    },
    errorMessage() {
      return this.$store.getters["data_card/getErrorMessage"];
    },
    isError() {
      return this.$store.getters["data_card/getError"];
    },
  },
  beforeRouteLeave(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked = this.$store.getters[
      "data_card/saveButtonClicked"
    ];

    if (cardChanged) {
      const confirmed = window.confirm("Закрыть без сохранения данных?");
      if (confirmed) {
        next();
      }
    } else {
      next();
    }
  },
};
</script>

<style>
.modal-dialog {
  min-width: 80%;
}
</style>
