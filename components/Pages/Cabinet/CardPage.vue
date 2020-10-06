<template>
  <div>
    <div v-if="isError">{{errorMessage.INFO ? errorMessage.INFO : errorMessage.MESSAGE}}</div>
    <div v-if="cardCaption" class="block-title pt-0 position-relative mt-2 mb-4">
      <i class="icon-my-profile"></i>{{ cardCaption }}
    </div>
    <b-modal v-if="!isError && settings.isModal" :modal-class="myclass" @close="closeModal" id="modal" no-close-on-backdrop hide-footer>
      <div class="block-title pt-0 position-relative mt-2 mb-4">
        <i class="icon-my-profile"></i>{{ settings.text }}
      </div>
      <CardEditor v-if="editable || (!settings.cardtemplate && !editable)" class="bg-six block-border-one block col p-4" :data="getFormData" :edit="editable" :params="settings"/>
      <v-runtime-template v-if="settings.cardtemplate" :template="settings.cardtemplate"></v-runtime-template>
    </b-modal>
    <div v-else class="profile row">
      <div class="col" v-if="editable || (!settings.cardtemplate && !editable && !isError)">
        <CardEditor class="bg-six block-border-one block p-4" :data="getFormData" :edit="editable" :params="settings"/>
      </div>
      <v-runtime-template v-if="!isError && settings.cardtemplate" :template="settings.cardtemplate"></v-runtime-template>
    </div>
  </div>
</template>

<script>
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import VRuntimeTemplate from "v-runtime-template";
import { isFieldExists, getField, getFieldValue } from "~/utils/utils.js";

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
    }
  },
  created() {
    this.edit();
  },
  mounted() {
    this.$bvModal.show("modal");
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
    getField(name, data = this.$store.getters["data_card/getForm"].data) {
      return data.find((item) => item.name === name);
    },
    getFieldValue(name, data = undefined) {
      return this.getField(name, data).value;
    },
    edit() {
      let flatmenu = this.$store.getters['menu/flatmenu']
      let menuItem = flatmenu.find(item => {
        return item.IDITEM == this.$route.params.idItem
      })
      this.editable = menuItem?.LEDIT;
    }
  },
  computed: {
    getFormData() {
      let formData = JSON.parse(JSON.stringify(this.$store.getters["data_card/getForm"]))
      return formData.length ? formData : formData.data
    },
    settings: {
      get: function () {
        return this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      },
    },
    cardCaption() {
      return this.$store.getters['data_card/cardCaption']
    },
    errorMessage() {
      return this.$store.getters['data_card/getErrorMessage']
    },
    isError() {
      return this.$store.getters['data_card/getError']
    }
  },
};
</script>

<style>
  .modal-dialog {
    min-width: 80vw;
  }
</style>
