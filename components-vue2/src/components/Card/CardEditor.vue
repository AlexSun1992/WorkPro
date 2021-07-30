<template>
  <div class="col-lg-12">
    <Form :data="getForm" :edit="true" @update="updateValue($event)" />
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
      isShowSavedError: false,
    };
  },
  async created() {
    let params = {
      idItem: this.menuId,
      idModule: this.moduleId,
      idParent: "0",
      idCard: "0",
    };
    await this.$store.dispatch("menu/fetchMenu", params);
    let { items } = await this.$store.dispatch("data_card/fetchList", params);
    params.idCard = items[0].ID;
    params.idRel = items[0].REL;
    await this.$store.dispatch("data_card/fetchForm", params);
    this.setting = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
  },
  computed: {
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getErrorMessage",
      "getSavedError",
    ]),
  },
  methods: {
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        data[i].checked = true;
        if (
          data[i].required &&
          !data[i].hidden &&
          data[i].visible &&
          (value === null || value === undefined || value === "") &&
          value !== 0
        ) {
          console.log("error", data[i]);
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
        }
      }
      return valid;
    },
    async updateValue(e) {
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM === this.menuId
      );
      let action = menu.ACTIONSCUR.find((item) => item.NTYPE === 38);
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
      const actionId = parseInt(e.value.replace("Item", ""));
      if (action.ID === actionId && this.validateData(this.getForm)) {
        this.isShowSavedError = false;
        let moduleId = this.moduleId,
          itemId = this.menuId,
          cardId = this.getFormParams.idCard,
          relId = this.getFormParams.idRel;
        let resp = await this.$store.dispatch("data_card/saveDataCard", {
          moduleId,
          itemId,
          cardId,
          relId,
          form: this.getForm,
        });
        if (resp.status === 200) {
          await this.$store.dispatch("data_card/fetchForm", this.getFormParams);
        }
      }
    },
  },
};
</script>

<style scoped></style>
