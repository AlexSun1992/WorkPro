<template>
  <div>
    <b-modal
      v-if="!isError && settings.isModal"
      id="modal"
      :modal-class="myclass"
      no-close-on-backdrop
      hide-footer
      @close="closeModal"
    >
      <div class="title-page position-relative ml-0"><i class="icon-my-profile" />{{ settings.text }}</div>
      <v-runtime-template
        v-if="settings.cardtemplate"
        :template="settings.cardtemplate"
      />
    </b-modal>

    <div class="profile row">
      <div
        v-if="isShowCardEditor"
        class="col"
      >
        <CardEditor
          ref="cardEditor"
          :wizard-tabs="wizardTabs"
          :data="getFormData"
          :edit="editable"
          :params="settings"
          :current-tab="currentTab"
          :tabsWizard="tabs"
          :qty="qty"
          :loading="loading"
          @goNext="$emit('goNext', $event)"
          @goBack="$emit('goBack', $event)"
          @saveCard="$emit('saveCard', $event)"
          @error="error = $event"
        />
      </div>
      <v-runtime-template
        v-else-if="isShowTemplate"
        :template="settings.cardtemplate"
      />
      <div v-else-if="isShowErrorMessage">
        {{ errorMessage }}
      </div>
    </div>
    <div class="row">
      <div :class="isShowCardTemplate">
        <div
          data-testid="danger-alert"
          v-show="isShowSavedError"
          class="mt-3 mb-0 alert alert-danger"
          v-html="errorMessage"
        />
      </div>
    </div>
    <div
      v-if="(isShowCardEditor && !isWizard) || (isWizard && $route.params.idCard == 0)"
      class="mt-3 row button-container"
    >
      <div
        v-if="settings.edit"
        :class="isShowCardTemplate"
      >
        <div
          v-for="(item, i) in action"
          :key="i"
          class="inbuttons"
        >
          <button
            type="button"
            v-if="item.LINBUTTONS"
            class="btn btn-outline-success button mr-4"
            @click="execAction(item)"
          >
            {{ item.SNAME }}
          </button>
        </div>
        <div
          v-if="(!isWizard || (isWizard && $route.params.idCard == 0)) && getFormData"
          class="row"
        >
          <div
            v-if="
              isShowButtons && isButtonSave && isWizard && $route.params.idCard === '0' && isWizardButtonSaveOutside
            "
            class="col-12 col-md-auto"
          >
            <button
              :id="wizardButtonSaveId"
              v-if="wizardButtonVisibleSave && isWizardButtonSaveOutside"
              class="btn btn-success"
              :class="wizardButtonStyleSave"
              pill
              :disabled="isDisabled"
              type="button"
              :style="isButtonDisabled"
              @click="saveDataCard(0)"
            >
              {{ wizardButtonNameSave }}
              <span
                v-if="loading"
                class="spinner-border text-danger ml-2"
              >
                <span class="sr-only"></span>
              </span>
            </button>
          </div>
          <div
            v-if="isButtonSave && !isWizard"
            class="col-12 col-md-auto mt-3 mt-md-0"
          >
            <button
              v-if="wizardButtonVisibleContinue"
              data-testid="saveButton"
              :id="wizardButtonSaveId"
              :class="wizardButtonStyleContinue"
              pill
              :disabled="isDisabled"
              type="button"
              class="btn btn-success"
              :style="isButtonDisabled"
              @click="saveDataCard(1)"
            >
              {{ wizardButtonNameSave }}
              <span
                v-if="loading"
                class="spinner-border text-danger ml-2"
              >
                <span class="sr-only"></span>
              </span>
            </button>
          </div>
          <div
            v-if="isButtonCancel && ref"
            class="col-12 col-md-auto mt-2 mt-md-0"
          >
            <button
              data-testid="cancelButton"
              pill
              type="button"
              class="btn btn-outline-success"
              :style="isButtonDisabled"
              @click="$router.push(ref)"
            >
              Отменить
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/v-runtime-template";
import CustomTab from "@/components/Libs/CustomTabs/CustomTab";
import CustomTabs from "@/components/Libs/CustomTabs/CustomTabs";
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import ActionButton from "~/components/Pages/Cabinet/Block/ActionButton";
import InsuranceCase from "~/components/Libs/InsuranceCase";

export default {
  name: "CardPage",
  components: {
    CardEditor,
    VRuntimeTemplate,
    /* eslint-disable vue/no-unused-components */
    ActionButton,
    InsuranceCase,
    CustomTab,
    CustomTabs,
  },

  props: {
    isShowButton: {
      type: Boolean,
      default: true,
    },
    currentTab: {
      required: false,
    },
    tabs: {
      required: false,
    },
    qty: {
      required: false,
    },
    loading: {
      required: false,
    },
    wizardTabs: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      myclass: ["cabinet"],
      error: null,
      isRouterComplete: false,
    };
  },
  async fetch({ store, route }) {
    await store.dispatch("data_card/fetchForm", {
      ...route.params,
      query: { ...route.query },
    });
  },
  computed: {
    isShowButtons() {
      return this.isShowButton;
    },
    isDisabled() {
      return this.$store.getters["data_card/isDisabled"];
    },
    editable() {
      const flatmenu = this.$store.getters["menu/flatmenu"];
      const menuItem = flatmenu.find((item) => item.IDITEM == this.$route.params.idItem);
      return menuItem?.LEDIT && !this.isReadOnly;
    },
    buttonTitle() {
      if (this.isWizard && this.$route.params.idCard === "0") {
        const wizardButtonContinue = this.$store.getters["data_card/getForm"].find(
          (item) => item.type === "WizardButton" && item.name === "Continue"
        );
        return wizardButtonContinue;
      }
      return null;
    },
    wizardButtonTitleSave() {
      const wizardButtonSave = this.$store.getters["data_card/getForm"].find(
        (item) => item.type === "WizardButton" && item.name === "Save"
      );
      return wizardButtonSave;
    },
    wizardButtonNameContinue() {
      return this.buttonTitle?.label ?? "Продолжить";
    },
    isWizardButtonSaveOutside() {
      return this.wizardButtonTitleSave?.page === 100;
    },
    wizardButtonNameSave() {
      return this.wizardButtonTitleSave?.label ?? "Сохранить";
    },
    wizardButtonStyleContinue() {
      return this.buttonTitle?.cssClass ?? "";
    },
    wizardButtonStyleSave() {
      return this.wizardButtonTitleSave?.cssClass ?? "";
    },
    wizardButtonVisibleContinue() {
      if (this.buttonTitle) {
        return this.buttonTitle.visible;
      }
      return true;
    },
    wizardButtonVisibleSave() {
      if (this.wizardButtonTitleSave) {
        return this.wizardButtonTitleSave.visible;
      }
      return true;
    },
    isButtonDisabled() {
      if (this.$refs.CardEditor) {
        return this.$refs.cardEditor.isButtonDisabled;
      }
      return false;
    },
    getFormData() {
      const formData = this.$store.getters["data_card/getForm"];

      return formData?.length >= 0 ? [...formData] : [...formData.data];
    },

    settings() {
      return this.$store.getters["menu/settings"].slice(-1).pop();
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
    action() {
      return this.$store.getters["menu/getMenuById"](this.$route.params.idItem).ACTIONSCUR;
    },
    captions() {
      return this.$store.getters["data_card/getCaptions"];
    },
    getLoading() {
      return this.$store.getters["data_card/getLoading"];
    },
    isShowWizardLoader() {
      return (
        this.getLoading ||
        this.loading ||
        this.$store.getters["wizard/getIsWizardButtonsLoading"] ||
        !this.getFormData ||
        !this.getFormData.length
      );
    },
    isButtonSave() {
      return this.$store.getters["data_card/getBtnSave"];
    },
    isButtonCancel() {
      return this.$store.getters["data_card/getBtnCancel"];
    },
    isReadOnly() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isWizard() {
      return this.$route.path.includes("wizard");
    },
    ref() {
      return this.$route.query?.ref;
    },
    cardId() {
      return this.$route.params.idCard;
    },
    relId() {
      return this.$route.params.idRel;
    },
    wizardButtonSaveId() {
      return this.wizardButtonTitleSave?.fieldId || "wizard-btn-title-save";
    },
    isShowCardEditor() {
      return (
        (Boolean(this.getFormData) || (this.editable && !this.isError)) && this.$store.getters[`data_card/getForm`].length
      );
    },
    isShowErrorMessage() {
      return this.isError && !this.getFormData;
    },
    isShowSavedError() {
      return this.$store.getters[`data_card/getSavedError`];
    },
    isShowTemplate() {
      return !this.isError && this.settings.cardtemplate && this.$store.getters[`data_card/getForm`].data;
    },
    isShowUploader() {
      return this.settings.isUploader;
    },
    isShowCardTemplate() {
      return this.settings.cardtemplate ? "col-sm-12 col-md-12 col-lg-12 col-xl-9 col-12" : "col-12";
    },
  },
  created() {
    this.$store.dispatch("menu/fetchCounters", null);
    this.$store.commit("data_card/setLoading", false);
  },
  mounted() {
    this.$bvModal.show("modal");
  },
  unmounted() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
    this.$store.commit("data_card/setErrorMessage", null);
  },
  watch: {
    getFormData(newValue, oldValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue) || newValue === undefined) {
        this.$store.dispatch("wizard/isWizardButtonsLoading", false);
      }
    },
  },
  methods: {
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
    getVisible(property) {
      const visible = this.$store.getters["data_card/getVisible"];
      if (visible[property] === "Y") {
        return true;
      }
      if (visible[property] === "N") {
        return false;
      }
      console.warn(
        `В методе getVisible свойство ${property}  не сущесвует или задано неверно. Доступные свойства: ${JSON.stringify(
          visible
        )}`
      );
    },
    getAddField(property) {
      const addFields = this.$store.getters["data_card/getAddFields"];
      if (addFields) {
        if (addFields[property]) {
          return addFields[property];
        }
        throw new Error(
          `В методе getAddField свойство ${property}  не сущесвует или задано неверно. Доступные свойства: ${JSON.stringify(
            addFields
          )}`
        );
      }
      throw new Error("Метод getAddField не может быть выполнен.");
    },
    showBtnBack() {
      const path = this.$store.state.data_card.listPath;
      return path && !path.includes("/55/0/19") && !path.includes("/55/0/738");
    },
    async saveDataCard(step) {
      if (this.$refs.cardEditor) {
        this.$store.commit("data_card/setValueByName", {
          name: step ? "Continue" : "Save",
          value: "CLICKED",
        });

        await this.$refs.cardEditor.saveDataCard(step);
        this.$store.commit("data_card/setValueByName", {
          name: step ? "Continue" : "Save",
          value: null,
        });
      }
    },
    cancelDataCard() {
      if (this.$refs.cardEditor) {
        this.$refs.cardEditor.cancelDataCard();
      }
    },
    async execAction(action) {
      this.error = null;
      const response = await this.$store.dispatch("data_card/executeAction", {
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
          this.$modal.alert({
            title: "Извините, произошла ошибка",
            msg: response.response.data.MESSAGE,
            icon: "error",
            btnOk: false,
          });
        }
      }
    },
  },
};
</script>
