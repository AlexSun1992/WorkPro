<template>
  <div>
    <div v-if="wizardIsError === false">
      <div v-if="cardCaption" class="title-page position-relative ml-0">
        {{ cardCaption }}
      </div>

      <template v-if="isShowCardTemplate">
        <v-runtime-template :template="settings.cardtemplate" />
      </template>

      <template v-else-if="pages">
        <b-nav
          v-if="!isWizardProgressBar"
          tabs
          justified
          class="mb-2 sticky-top"
        >
          <b-nav-item
            v-for="(item, index) in tabs"
            :key="item.id"
            :to="getURL(item, index)"
            exact
            exact-active-class="active"
          >
            {{ item.name }}
          </b-nav-item>
        </b-nav>

        <template v-else>
          <WizardProgressBar
            v-if="settingsByItem.isUploader === false"
            :current-tab="currentTab"
            :tabs="tabs"
            :qty="settings.wizard.length"
            :loading="isLoading"
          />
        </template>
      </template>

      <nuxt-child
        ref="child"
        :key="$route.fullPath"
        :wizard-tabs="settings.wizard"
        :current-tab="currentTab"
        :tabs="tabs"
        :isShowButton="isShowButton"
        :qty="settings.wizard.length"
        :loading="isLoading"
        @goNext="goNext($event)"
        @goBack="goBack($event)"
        @saveCard="saveCard($event)"
      />
      <div class="row">
        <div
          v-if="isErrorActionExecuteMessage"
          class="mt-3 mb-0"
          :class="
            isUseCardTemplate
              ? 'col-sm-12 col-md-12 col-lg-12 col-xl-9 col-12'
              : 'col-12'
          "
        >
          <b-alert :show="isErrorActionExecuteMessage" variant="danger">
            {{ errorActionExecuteMessage }}
          </b-alert>
        </div>
      </div>

      <wizard-buttons
        v-if="btnsWizardOutside && isShowButton"
        :current-tab="currentTab"
        :tabs="tabs"
        :qty="settings.wizard.length"
        :loading="isLoading"
        @goNext="goNext($event)"
        @goBack="goBack($event)"
        @saveCard="saveCard($event)"
      />
    </div>
    <div v-else>
      {{ wizardErrorMessage }}
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import menuSettings from "~/converters/menuSettings";
import WizardButtons from "~/components/Pages/Cabinet/Wizard/WizardButtons";
import WizardProgressBar from "./WizardProgressBar.vue";

export default {
  name: "Wizard",
  components: {
    WizardProgressBar,
    WizardButtons,
    VRuntimeTemplate,
  },
  data() {
    return {
      loading: false,
    };
  },
  async fetch({ store, route }) {
    await store.dispatch("wizard/fetchWizard", route.params);
  },
  computed: {
    isShowButton() {
      return this.$store.getters["data_card/isShowWizardButton"](
        this.settingsByItem.isUploader
      );
    },
    isLoading() {
      return this.$store.getters["wizard/getIsWizardButtonsLoading"];
    },
    btnsWizardOutside() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtons = fields.filter(
        (item) => item.type === "WizardButton"
      );
      return wizardButtons.every((button) => button.page === 100);
    },
    settings: {
      get() {
        return menuSettings
          .getData(this.$store.getters["menu/menu"], {
            idModule: 55,
            idParent: 0,
            idItem: this.$route.params.idWizard,
          })
          .slice(-1)
          .pop();
      },
    },
    settingsByItem() {
      return this.$store.getters["menu/getSettingsByIdItem"](
        this.$route.params.idItem || {}
      );
    },
    rels() {
      const rel = this.$store.getters["wizard/getWizard"]?.REL;
      if (this.$route.params.idCard !== "0" && rel) {
        return rel;
      }
      return "|";
    },
    pages() {
      return this.$store.getters["wizard/getWizardPages"];
    },
    tabs() {
      const t = this.settings.wizard;
      const arr = [];
      if (this.pages) {
        const p_arr = this.pages.split(";");
        for (let i = 0; i < t.length; i++) {
          const p_item = p_arr.find((v) => parseInt(v) === t[i].idItem);
          if (p_item) {
            arr.push(t[i]);
          }
        }
      }
      return arr;
    },
    currentTab() {
      return this.tabs.find((item) => item.idItem == this.$route.params.idItem);
    },
    cardCaption() {
      return this.$store.getters["wizard/getWizardCaption"];
    },
    wizardIsError() {
      return this.$store.getters["wizard/getWizardIsError"];
    },
    isCardError() {
      return this.$store.getters["data_card/getError"];
    },
    wizardErrorMessage() {
      return (
        this.$store.getters["wizard/getWizardErrorMessage"] ||
        this.$store.getters["data_card/getErrorMessage"]
      );
    },
    isShowCardTemplate() {
      const cardTemplate = this.settings?.cardtemplate.trim();

      return (
        !!cardTemplate &&
        cardTemplate.indexOf("<!--") !== 0 &&
        cardTemplate.lastIndexOf("-->") !== cardTemplate.length - 3
      );
    },
    isErrorActionExecuteMessage() {
      return this.$store.getters["wizard/getWizardIsErrorActionExecute"];
    },
    errorActionExecuteMessage() {
      return this.$store.getters["wizard/getWizardErrorActionExecuteMessage"];
    },
    isSavedError() {
      return this.$store.getters["data_card/getSavedError"];
    },
    isLoadSuccessFull() {
      return this.$store.getters["uploader/isLoadSuccessFull"];
    },
    maxTabsForIconWizard() {
      return this.$store.getters["wizard/iconTabsCount"];
    },
    isUseCardTemplate() {
      return Boolean(
        this.$store.getters["menu/getMenuById"](this.$route.params.idItem)
          ?.SVJCARDTEMPLATE && !this.$store.getters[`data_card/getForm`]?.data
      );
    },
    isWizardProgressBar() {
      return this.tabs.length > this.maxTabsForIconWizard;
    },
    progressComponent() {
      return this.tabs && this.tabs.length < 9 ? WizardButtons : WizardLine;
    },
  },
  unmounted() {
    this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
  },
  methods: {
    getURL(item) {
      const settingsTab = this.$store.getters["menu/getSettingsByIdItem"](
        item.idItem || {}
      );
      if (settingsTab?.isUploader === true) {
        return `/cabinet/wizard/${this.$route.params.idWizard}/55/0/${
          item.idItem
        }/${this.$route.params.idCard}/${
          this.rels.split("|")[item.order - 1]
        }/uploader`;
      }
      if (this.$route.params.idCard === "0") {
        return `/cabinet/wizard/${this.$route.params.idWizard}${
          item.list ? `/list/55/0/` : `/55/0/`
        }${item.idItem}/0/0`;
      }
      return `/cabinet/wizard/${this.$route.params.idWizard}${
        item.list ? `/list/55/0/` : `/55/0/`
      }${item.idItem}/${this.$route.params.idCard}/${
        this.rels.split("|")[item.order - 1]
      }`;
    },
    async goNext(e) {
      this.$store.dispatch("wizard/isWizardButtonsLoading", true);
      if (!this.currentTab.list) {
        if (this.$store.getters["data_card/getBtnSave"]) {
          if (this.$refs.child.$refs.cardEditor !== undefined) {
            this.$store.commit("data_card/setValueByName", {
              name: "Continue",
              value: "CLICKED",
            });
            await this.$refs.child.$refs.cardEditor.saveDataCard();
            this.$store.commit("data_card/setValueByName", {
              name: "Continue",
              value: null,
            });
            if (this.isSavedError === true) {
              this.$store.dispatch("wizard/isWizardButtonsLoading", false);
              return;
            }
          } else {
            const itemId = this.$route.params.idItem;
            const moduleId = this.$route.params.idModule;
            const cardId = this.$route.params.idCard;
            const relId = this.$route.params.idRel;
            const formData = this.$store.getters["data_card/getForm"];
            await this.$store.dispatch("data_card/saveDataCard", {
              moduleId,
              itemId,
              cardId,
              relId,
              form: formData.length ? formData : formData.data,
            });
            if (this.isSavedError === true) {
              this.$store.dispatch("wizard/isWizardButtonsLoading", true);
              return;
            }
          }
        }
      }
      this.$router.push(this.getURL(e));
    },
    async goBack(e) {
      this.$router.push(this.getURL(e));
    },
    async saveCard() {
      this.$store.dispatch("wizard/isWizardButtonsLoading", true);
      if (this.$refs.child.$refs.cardEditor !== undefined) {
        this.$store.commit("data_card/setValueByName", {
          name: "Save",
          value: "CLICKED",
        });
        await this.$refs.child.$refs.cardEditor.saveDataCard(0);
        this.$store.commit("data_card/setValueByName", {
          name: "Save",
          value: null,
        });
        if (this.isSavedError === true) {
          this.$store.dispatch("wizard/isWizardButtonsLoading", false);
          return;
        }
      }
      this.$store.dispatch("wizard/isWizardButtonsLoading", false);
    },
  },
};
</script>

<style>
.dropdown > ul {
  min-width: fit-content;
}

.dropdown-item:hover {
  background-color: #ccc !important;
}

.dropdown-item:hover > button {
  background-color: #ccc !important;
}

.dropdown-item > button {
  background-color: white !important;
  color: black !important;
  box-shadow: none !important;
}

.wizard-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
