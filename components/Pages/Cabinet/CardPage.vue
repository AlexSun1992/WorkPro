<template>
  <div>
    <div
      v-if="cardCaption && !isWizard"
      class="block-title pt-0 position-relative mt-2 mb-4"
    >
      <i class="icon-my-profile"></i>{{ cardCaption }}
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
        @error="error = $event"
        ref="cardEditor"
        v-if="editable || (!settings.cardtemplate && !editable)"
        :wizard-tabs="wizardTabs"
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
      <div class="col" v-if="isShowCardEditor">
        <CardEditor
          v-if="getFormData"
          @error="error = $event"
          ref="cardEditor"
          :wizard-tabs="wizardTabs"
          class="block-profile"
          :data="getFormData"
          :edit="editable"
          :params="settings"
        />
      </div>
      <v-runtime-template
        v-else-if="isShowTemplate"
        :template="settings.cardtemplate"
      ></v-runtime-template>
      <div v-else-if="isShowErrorMessage">
        {{ errorMessage }}
      </div>
    </div>
    <b-alert :show="isError && !!getFormData" variant="danger" class="mt-4">{{
      errorMessage
    }}</b-alert>
    <div v-if="isShowCardEditor" class="mt-3 mb-3 row button-container">
      <div class="col-12" v-if="settings.edit">
        <div class="inbuttons" v-for="(item, i) in action" :key="i">
          <b-button
            v-if="item.LINBUTTONS"
            @click="execAction(item)"
            class="button mr-4"
            variant="outline-success"
            >{{ item.SNAME }}
          </b-button>
        </div>
        <div
          v-if="!isWizard || (isWizard && $route.params.idCard == 0)"
          :class="{ 'btn-right': isWizard && $route.params.idCard == 0 }"
        >
          <div v-if="getFormData">
            <b-button
              v-if="isButtonSave"
              pill
              :disabled="loading"
              v-on:click="saveDataCard"
              type="button"
              variant="success"
              class="col-12 col-md-auto mr-4"
              :style="isButtonDisabled"
            >
              {{ buttonTitle }}
              <b-spinner
                v-if="loading"
                style="width: 1rem; height: 1rem"
                class="ml-2"
                variant="danger"
                label="Spinning"
              ></b-spinner>
            </b-button>
            <b-button
              v-if="ref"
              pill
              v-on:click="$router.push(ref)"
              type="button"
              variant="outline-success"
              class="col-12 col-md-auto mt-2 mt-md-0"
              :style="isButtonDisabled"
              >Отменить</b-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import VRuntimeTemplate from "v-runtime-template";
import { saveAs } from "file-saver";
import ControlButton from "~/components/Libs/Controls/ControlButton";

export default {
  name: "CardPage",
  components: { CardEditor, VRuntimeTemplate, ControlButton },
  async fetch({ store, route }) {
    await store.dispatch("data_card/fetchForm", route.params);
  },
  props: {
    wizardTabs: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      editable: true,
      myclass: ["cabinet"],
      error: null,
    };
  },
  created() {
    this.$store.commit("data_card/setLoading", false);
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
      this.editable = menuItem?.LEDIT && !this.isReadOnly;
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
    showBtnBack() {
      let path = this.$store.state.data_card.listPath;
      return path && !path.includes("/55/0/19") && !path.includes("/55/0/738");
    },
    saveDataCard() {
      if (this.$refs.cardEditor) {
        this.$refs.cardEditor.saveDataCard();
      }
    },
    cancelDataCard() {
      if (this.$refs.cardEditor) {
        this.$refs.cardEditor.cancelDataCard();
      }
    },
    async execAction(action) {
      this.error = null;
      let response = await this.$store.dispatch("data_card/executeAction", {
        actionId: action.ID,
        relActionId: action.REL,
        relId: this.$route.params.idRel,
        rowId: this.$route.params.idCard,
        itemId: action.NITEM,
      });
      if (response?.response) {
        if (this.$route.path.includes("55/0/19")) {
          this.error = response.response.data.MESSAGE;
        } else {
          this.$bvToast.toast(response.response.data.MESSAGE, {
            title: "Ошибка",
            variant: "danger",
            noAutoHide: true,
            solid: true,
          });
        }
      }
    },
  },
  computed: {
    buttonTitle() {
      if (this.isWizard && this.$route.params.idCard === "0") {
        return "Продолжить";
      } else {
        return "Сохранить";
      }
    },
    isButtonDisabled() {
      if (this.$refs.CardEditor) {
        return this.$refs.cardEditor.isButtonDisabled;
      }
    },
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
    action: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](
          this.$route.params.idItem
        ).ACTIONSCUR;
      },
    },
    captions: function () {
      return this.$store.getters["data_card/getCaptions"];
    },
    isButtonSave: function () {
      return this.$store.getters["data_card/getBtnSave"];
    },
    isReadOnly: function () {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isWizard() {
      return this.$route.path.includes("wizard");
    },
    loading() {
      return this.$store.getters["data_card/getLoading"];
    },
    ref() {
      return this.$route.query?.ref;
    },
    isShowCardEditor() {
      return (
        ((!this.settings.cardtemplate && !!this.getFormData) ||
          (this.editable && !this.isError)) &&
        this.$store.getters[`data_card/getForm`].length
      );
    },
    isShowErrorMessage() {
      return this.isError && !this.getFormData;
    },
    isShowTemplate() {
      return (
        !this.isError &&
        this.settings.cardtemplate &&
        this.$store.getters[`data_card/getForm`].data
      );
    },
  },
  beforeRouteLeave(to, from, next) {
    const cardChanged = this.$store.getters["data_card/cardChanged"];
    const saveButtonClicked = this.$store.getters[
      "data_card/saveButtonClicked"
    ];
    if (cardChanged) {
      this.$bvModal
        .msgBoxConfirm("Закрыть страницу без сохранения данных?", {
          title: "Переход на другую страницу",
          size: "sm",
          buttonSize: "sm",
          okVariant: "primary",
          okTitle: "Закрыть",
          cancelTitle: "Отмена",
          footerClass: "p-2",
          modalClass: this.myclass,
          hideHeaderClose: false,
          centered: true,
        })
        .then(async (value) => {
          if (value) {
            next();
          }
        })
        .catch((err) => {
          next(err);
        });
    } else {
      next();
    }
  },
};
</script>

<style>
.inbuttons {
  display: inline-block;
}

.btn-right {
  display: flex;
  justify-content: flex-end;
}
</style>
