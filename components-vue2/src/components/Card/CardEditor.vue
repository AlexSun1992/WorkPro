<template>
  <div class="col-lg-12">
    <Form :data="getForm" :edit="!isReadOnly" @update="updateValue($event)" />
    <div class="row">
      <div>
        <b-alert :show="getSavedError" variant="danger" class="mt-3 mb-0">
          {{ getErrorMessage }}
        </b-alert>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Form from "/../components/Libs/Form/Form.vue";
import Vue from "vue";
import { BootstrapVue } from "bootstrap-vue";
import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);
Vue.use(BootstrapVue);

export default {
  name: "CardEditor",
  components: { Form },
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
  data() {
    return {
      params: {
        idItem: this.menuId,
        idModule: this.moduleId,
        idParent: "0",
        idCard: "0",
        idRel: "0",
        zone: "free",
      },
      isShowSavedError: false,
      eventHandler: null,
    };
  },
  async created() {
    await this.$loadScript(
      `/api/card/js/${this.moduleId}/${
        this.menuId
      }?zone=free&time=${Date.now()}`
    );
    await this.$store.dispatch("menu/fetchMenu", this.params);
    this.eventHandler =
      typeof eventHandler === "function" ? eventHandler : null;
    await this.fetchCard();
    this.setting = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
  },
  computed: {
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getErrorMessage",
      "getSavedError",
    ]),
    ...mapGetters("auth", ["getLogged", "getUser"]),
    isReadOnly: function () {
      return this.$store.getters["data_card/getReadOnly"];
    },
  },
  methods: {
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        data[i].checked = true;
        const error = data[i].error;
        if (
          (data[i].required &&
            !data[i].hidden &&
            data[i].visible &&
            (value === null || value === undefined || value === "") &&
            value !== 0) ||
          error
        ) {
          console.log("error", data[i]);
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
        }
      }
      return valid;
    },
    async callScript(e, action = null) {
      let data = await this.eventHandler(
        this.getForm.map((a) => Object.assign({}, a)),
        e,
        action
      );
      if (data) {
        this.$store.commit("data_card/setForm", data || this.getForm);
      }
    },
    async fetchCard() {
      let { items } = await this.$store.dispatch(
        "data_card/fetchList",
        this.params
      );
      this.params.idCard = items[0].ID;
      this.params.idRel = items[0].REL;
      await this.$store.dispatch("data_card/fetchForm", this.params);
    },
    async updateValue(e) {
      let field = this.getForm.find((f) => f.fieldId === e.fieldId);
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM === this.menuId
      );
      await this.callScript(e);
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
      if (field.type === "button" && e.action) {
        const actionId = parseInt(e.value.replace("Item", ""));
        const actionRefreshCard = menu.ACTIONSCUR.find(
          (item) => item.NTYPE === 39
        );
        const actionSaveCard = menu.ACTIONSCUR.find(
          (item) => item.NTYPE === 38
        );
        await this.callScript(e, "beforeSave");
        if (actionSaveCard.ID === actionId && this.validateData(this.getForm)) {
          this.isShowSavedError = false;
          let moduleId = this.moduleId,
            itemId = this.menuId,
            cardId = this.getFormParams.idCard,
            relId = this.getFormParams.idRel,
            zone = "free";
          let resp = await this.$store.dispatch("data_card/saveDataCard", {
            moduleId,
            itemId,
            cardId,
            relId,
            zone,
            form: this.getForm,
          });
          if (resp.status === 200) {
            await this.$store.dispatch("data_card/fetchForm", {
              ...this.getFormParams,
              zone: "free",
            });
            await this.callScript(e, "afterSave");
          }
        }
        if (actionRefreshCard?.ID === actionId) {
          await this.fetchCard();
        }
      }
    },
  },
};
</script>

<style scoped></style>
