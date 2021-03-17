<template>
  <div>
    <b-modal
      modal-class="cabinet"
      :id="'confirmAction'"
      centered
      :title="actionParamsTitle"
      ok-title="Выполнить"
      cancel-title="Отмена"
      no-close-on-backdrop
      @ok="applyAction"
      no-fade
    >
      <b-alert :show="isActionApplyError" variant="danger">{{
        actionApplyErrorMessage
      }}</b-alert>
      <Form
        v-if="actionParams.length"
        :data="actionParams"
        :edit="true"
        @update="updateActionParams($event)"
      ></Form>
    </b-modal>
    <div v-if="data.length">
      <Form
        v-if="!isAccordion"
        :data="data"
        :tabs="tabs"
        @update="updateValue($event)"
        @clear="clearRelation($event)"
        @open-card="openCard($event)"
        :edit="edit"
      ></Form>
      <FormAccordion
        v-else-if="isAccordion"
        :class="{ 'mt-5': !params.settings && showBtnBack }"
        :data="data"
        :tabs="tabs"
        @update="updateValue($event)"
        @clear="clearRelation($event)"
        @open-card="openCard($event)"
        :edit="edit"
      />
    </div>
    <SkeletonBox v-if="!data.length" class="mt-5" :items="8"></SkeletonBox>
    <!--    <div class="error-message" v-if="isError">-->
    <!--      {{ errorMessage.INFO ? errorMessage.INFO : errorMessage.MESSAGE }}-->
    <!--    </div>-->
  </div>
</template>

<script>
import Form from "~/components/Libs/Form/Form";
import ActionButton from "~/components/Pages/Cabinet/Block/ActionButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FormAccordion from "@/components/Libs/Form/FormAccordion";
import formConverter from "@/converters/form";
import consts from "~/api/urls";
export default {
  name: "CardEditor",
  head() {
    return {
      script: [
        {
          // type: "module",
          src: `/api/card/js/${this.$route.params.idModule}/${this.$route.params.idItem}`,
          callback: () => {
            this.stripeLoaded();
          },
        },
      ],
    };
  },
  components: { FormAccordion, Form, ActionButton, SkeletonBox },
  data() {
    return {
      invalidFields: [],
      body: null,
      actionParamsTitle: null,
      actionParamsId: null,
      isActionApplyError: false,
      actionApplyErrorMessage: null,
      disabledButtons: {
        background: "#dddbdd",
        boxShadow: "none",
        border: "none",
        color: "#dddbdd",
      },
      source: "",
    };
  },
  props: {
    params: {
      type: Object,
      required: true,
      default: () => {},
    },
    data: {
      type: Array,
      required: true,
      default: () => [],
    },
    edit: {
      type: Boolean,
      required: false,
      default: () => true,
    },
    wizardTabs: {
      type: Array,
      required: false,
    },
  },
  mounted() {
    this.stripeLoaded();
  },
  destroyed() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
  },
  methods: {
    stripeLoaded() {
      try {
        if (typeof initHandler === "function") {
          this.$store.commit(
            "data_card/setForm",
            initHandler(this.data.map((a) => Object.assign({}, a))) || this.data
          );
        }
      } catch {}
    },
    async updateValue(e) {
      this.$store.commit("data_card/cardChanged", true);
      if (typeof eventHandler === "function") {
        let data = await eventHandler(
          this.data.map((a) => Object.assign({}, a)),
          e,
          this.fetchCard
        );
        if (data) {
          this.$store.commit("data_card/setForm", data || this.data);
        }
      }
      let field = this.data.find((f) => f.fieldId === e.fieldId);
      if (field.type === "button") {
        this.isActionApplyError = false;
        const actionId = e.value.replace("Item", "");
        let moduleId;
        let cardId;
        if (!this.params.page) {
          moduleId = this.$route.params.idModule;
          cardId = this.$route.params.idCard;
        } else {
          moduleId = this.params.page.idModule;
          cardId = this.$store.getters["data_card/getCardId"];
        }
        let actionParams = await this.$store.dispatch(
          "data_card/fetchActionParams",
          {
            moduleId,
            actionId,
            cardId,
          }
        );
        this.actionParamsTitle = field.label;
        this.actionParamsId = parseInt(actionId);
        if (actionParams.length) {
          this.$bvModal.show("confirmAction");
        } else {
          this.applyAction();
        }
      }
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
    },
    async fetchCard(method, url) {
      try {
        this.cancelRequest();
        this.source = this.$axios.CancelToken.source();

        let result = await this.$axios[method](url, {
          cancelToken: this.source.token,
        });

        if (result) {
          this.source = "";
          return result.data[0];
        }
      } catch (e) {
        console.log(e);
      }
    },
    cancelRequest() {
      if (this.source) {
        this.source.cancel("Cancelled");
        console.log("cancel request done");
      }
    },
    clearRelation(e) {
      this.$store.commit("data_card/clearFormRelationField", {
        fieldName: e.fieldName,
      });
    },
    openCard(e) {
      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find((item) => {
        return item.SNAME == e.label;
      });
      $nuxt._router.push(
        `/cabinet/${this.params.page.idModule}/0/${menuItem.IDITEM}/0`
      );
    },
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        data[i].checked = true;
        if (
          data[i].required &&
          (value === null || value === undefined || value === "") &&
          data[i].type !== "boolean" &&
          value !== 0
        ) {
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
        }
      }
      return valid;
    },
    async saveDataCard() {
      this.$store.commit("data_card/cardChanged", false);
      this.$store.commit("data_card/saveButtonClicked", true);
      const fields = this.$store.getters["data_card/getForm"];
      if (this.validateData(fields)) {
        try {
          let itemId;
          let moduleId;
          let cardId;
          let relId;
          if (!this.params.page) {
            itemId = this.$route.params.idItem;
            moduleId = this.$route.params.idModule;
            cardId = this.$route.params.idCard;
            relId = this.$route.params.idRel;
          } else {
            itemId = this.params.page.idItem;
            moduleId = this.params.page.idModule;
            cardId = this.$store.getters["data_card/getCardId"];
            relId = this.$store.getters["data_card/getCardRelId"];
          }
          let resp = await this.$store.dispatch("data_card/saveDataCard", {
            moduleId,
            itemId,
            cardId,
            relId,
            form: fields,
          });
          if (this.$route.params.idItem === "710") {
            await this.$store.dispatch("updateUser");
          }
          if (this.$route.params.idCard === "0" && !this.$route.query?.ref) {
            cardId = this.$store.getters["data_card/getCardId"];
            relId = this.$store.getters["data_card/getCardRelId"];
            if (this.$route.params.idWizard) {
              this.$store.commit("data_card/setLoading", true);
              await this.$store.dispatch("wizard/fetchWizard", {
                idModule: this.$route.params.idModule,
                idWizard: this.$route.params.idWizard,
                idCard: cardId,
              });
              this.$store.commit("data_card/setLoading", false);
              let tab = this.wizardTabs[1];
              const rel = this.$store.getters["wizard/getWizard"]?.REL;
              this.$router.push(
                `/cabinet/wizard/${this.$route.params.idWizard}${
                  tab.list ? `/list/` : `/`
                }${moduleId}/0/${tab.idItem}/${cardId}/${rel.split("|")[1]}`
              );
            } else {
              this.$router.push(
                `/cabinet/${moduleId}/0/${itemId}/${cardId}${
                  relId ? `/${relId}` : ""
                }`
              );
            }
          } else {
            if (this.$route.query?.ref && resp) {
              this.$router.push(this.$route.query?.ref);
            }
          }
          if (resp) {
            this.$bvToast.toast("Успешно сохранено", {
              title: "",
              variant: "success",
              solid: true,
            });
          }
          this.$emit("error", null);
        } catch (err) {
          if (this.$route.path.includes("55/0/19")) {
            this.$emit(
              "error",
              err?.response?.data?.INFO || err?.response?.data?.MESSAGE
            );
          }
          let errorInfo = err?.response?.data?.INFO
            ? err?.response?.data?.INFO
            : err?.response?.data?.MESSAGE;
          if (errorInfo) {
            this.$store.commit("data_card/setFieldError", errorInfo);
          }
        }
      }
    },
    cancelDataCard() {
      this.$store.commit("data_card/cardChanged", false);
      this.$store.commit(
        "data_card/setForm",
        JSON.parse(JSON.stringify(this.$store.getters["data_card/getCopyForm"]))
      );
    },
    goBack() {
      this.$router.push(this.$store.state.data_card.listPath);
    },
    updateActionParams(e) {
      this.$store.commit("data_card/setActionParamsField", e);
    },
    async applyAction(evt) {
      if (evt) evt.preventDefault();
      this.isActionApplyError = false;
      const action = this.params.actions.find(
        (f) => f.id === this.actionParamsId
      );
      let response = await this.$store.dispatch("data_card/executeAction", {
        actionId: this.actionParamsId,
        relActionId: action.relaction,
        relId: this.$route.params.idRel,
        rowId: this.$route.params.idCard,
        body: this.actionParams,
      });
      if (response.status === 500) {
        this.isActionApplyError = true;
        this.actionApplyErrorMessage = response.data.INFO
          ? response.data.INFO
          : response.data.MESSAGE;
      }
      if (response.status === 200) {
        if (response.data.POUTVALUE) {
          if (response.data.POUTVALUE.includes("/")) {
            window.open(response.data.POUTVALUE);
          }
        }
        await this.$store.dispatch("data_card/fetchForm", this.$route.params);
        this.$bvModal.hide("confirmAction");
        this.$bvToast.toast("Успешно выполнено", {
          title: "",
          variant: "success",
          solid: true,
        });
      }
    },
  },
  computed: {
    isButtonDisabled() {
      if (!this.data.length) {
        return this.disabledButtons;
      }
    },
    errorMessage() {
      return this.$store.getters["data_card/getErrorMessage"];
    },
    isError() {
      return this.$store.getters["data_card/getError"];
    },
    showBtnBack() {
      let path = this.$store.state.data_card.listPath;
      // Жестко убрали кнопку с полиса осаго (Игорь)
      return path && !path.includes("/55/0/19") && !path.includes("/55/0/738");
    },
    tabs() {
      return this.params.tabs;
    },
    captions: function () {
      return this.$store.getters["data_card/getCaptions"];
    },
    isAccordion: function () {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
        .LACCORDION;
    },
    actionParams: function () {
      return this.$store.getters["data_card/getActionParams"];
    },
  },
};
</script>

<style scoped>
.modal-content {
  min-height: 500px;
}
.action-button {
  position: absolute;
  right: 220px;
  bottom: 65px;
}
.error-message {
  padding: 15px;
}
</style>
