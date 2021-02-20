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
          @error="error = $event"
          ref="cardEditor"
          class="bg-six block-border-one block p-4"
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
    <div v-if="!isError" class="mt-3 mb-3 row button-container">
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
        <b-button
          v-if="isButtonSave"
          pill
          v-on:click="saveDataCard"
          type="button"
          variant="success"
          class="col-12 col-md-auto mr-4"
          :style="isButtonDisabled"
          >Сохранить</b-button
        >
      </div>
    </div>
    <div v-if="error" class="mt-3 mb-3">
      <p><strong>Сообщения при оформлении полиса:</strong></p>
      <b-form-textarea rows="8" v-model="error"> </b-form-textarea>
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
  data() {
    return {
      editable: true,
      myclass: ["cabinet"],
      error: null,
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
    isWizard() {
      return this.$route.path.includes("wizard");
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
.inbuttons {
  display: inline-block;
}
</style>
