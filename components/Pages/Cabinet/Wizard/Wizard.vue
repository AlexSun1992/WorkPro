<template>
  <div>
    <div v-if="wizardIsError === false">
      <div
        v-if="cardCaption"
        class="title-page position-relative ml-0"
      >
        {{ cardCaption }}
      </div>

      <template v-if="isShowCardTemplate">
        <v-runtime-template :template="settings.cardtemplate" />
      </template>

      <template v-else-if="pages">
        <custom-tabs
          v-if="!isWizardProgressBar"
          :tabs="visitedTabs"
          :default-index="currentTabIndex"
          :is-slot-needed="false"
          class="mb-2 sticky-top"
          @change="onTabChange"
        />

        <template v-else>
          <WizardProgressBar
            v-if="settingsByItem.isUploader === false && isWizardUpdated === true"
            :current-tab="currentTab"
            :tabs="tabs"
            :qty="settings.wizard.length"
            :loading="isLoading"
          />
        </template>
      </template>

      <nuxt-child
        ref="child"
        :wizard-tabs="settings.wizard"
        :current-tab="currentTab"
        :tabs="tabs"
        :is-show-button="isShowButton"
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
          :class="isUseCardTemplate ? 'col-sm-12 col-md-12 col-lg-12 col-xl-9 col-12' : 'col-12'"
        >
          <div
            id="errorAlert"
            class="alert alert-danger"
          >
            {{ errorActionExecuteMessage }}
          </div>
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
import VRuntimeTemplate from "@/components/Libs/RuntimeTemplate/RuntimeTemplate";
import menuSettings from "~/converters/menuSettings";
import WizardButtons from "~/components/Pages/Cabinet/Wizard/WizardButtons";
import WizardProgressBar from "./WizardProgressBar";
import CustomTabs from "@/components/Libs/CustomTabs/CustomTabs";

export default {
  name: "Wizard",
  components: {
    WizardProgressBar,
    WizardButtons,
    VRuntimeTemplate,
    CustomTabs,
  },
  data() {
    return {
      isWizardUpdated: false,
    };
  },
  async fetch({ store, route }) {
    await store.dispatch("wizard/fetchWizard", route.params);
  },
  computed: {
    isShowButton() {
      return this.$store.getters["data_card/isShowWizardButton"](this.settingsByItem.isUploader);
    },
    isLoading() {
      return this.$store.getters["wizard/getIsWizardButtonsLoading"];
    },
    btnsWizardOutside() {
      const formData = this.$store.getters["data_card/getForm"];
      const fields = formData.length ? formData : formData.data || [];
      const wizardButtons = fields.filter((item) => item.type === "WizardButton");
      return wizardButtons.every((button) => button.page === 100);
    },
    settings() {
      return menuSettings
        .getData(this.$store.getters["menu/menu"], {
          idModule: 55,
          idParent: 0,
          idItem: this.$route.params.idWizard,
        })
        .slice(-1)
        .pop();
    },
    settingsByItem() {
      return this.$store.getters["menu/getSettingsByIdItem"](this.$route.params.idItem || {});
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

    visitedTabs() {
      return this.tabs.map((item) => item.name);
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
    currentTabIndex() {
      return this.tabs.findIndex((item) => item.id === this.currentTab?.id);
    },

    currentTab() {
      return this.tabs.find((item) => `${item.idItem}` === this.$route.params.idItem);
    },
    cardCaption() {
      return this.$store.getters["wizard/getWizardCaption"];
    },
    wizardIsError() {
      return this.$store.getters["wizard/getWizardIsError"];
    },
    wizardErrorMessage() {
      return this.$store.getters["wizard/getWizardErrorMessage"] || this.$store.getters["data_card/getErrorMessage"];
    },
    isShowCardTemplate() {
      const cardTemplate = this.settings?.cardtemplate.trim();

      return (
        Boolean(cardTemplate) &&
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
        this.$store.getters["menu/getMenuById"](this.$route.params.idItem)?.SVJCARDTEMPLATE &&
          !this.$store.getters[`data_card/getForm`]?.data
      );
    },
    isWizardProgressBar() {
      return this.tabs.length > this.maxTabsForIconWizard;
    },
  },
  mounted() {
    this.$store.commit("wizard/setIsWizard", true);
  },

  created() {
    this.updateWizard();
  },
  beforeUnmount() {
    this.$store.commit("wizard/setIsWizard", false);
  },
  unmounted() {
    this.$store.commit("wizard/setWizardIsErrorActionExecute", false);
  },
  methods: {
    onTabChange(index) {
      const item = this.tabs[index];
      if (!item) {
        return;
      }
      const url = this.getUrl(item, index);
      this.$router.push(url).catch((e) => {
        console.error("error:", e);
      });
    },
    async updateWizard() {
      const findWizardSteps = this.$store.getters["data_card/getForm"]?.find((item) => item.name === "BWIZARDSTEPS");

      if (findWizardSteps?.value) {
        this.isWizardUpdated = false;

        this.$store.commit("wizard/setForceUpdate", true, { root: true });

        await this.$store.dispatch("wizard/fetchWizard", this.$route.params);

        this.$store.commit("wizard/setForceUpdate", false, { root: true });
      }
      this.isWizardUpdated = true;
    },
    getURL(item) {
      const settingsTab = this.$store.getters["menu/getSettingsByIdItem"](item.idItem || {});
      if (settingsTab?.isUploader === true) {
        return `/cabinet/wizard/${this.$route.params.idWizard}/55/0/${item.idItem}/${this.$route.params.idCard}/${
          this.rels.split("|")[item.order - 1]
        }/uploader`;
      }
      if (this.$route.params.idCard === "0") {
        return `/cabinet/wizard/${this.$route.params.idWizard}${item.list ? `/list/55/0/` : `/55/0/`}${
          item.idItem
        }/0/0`;
      }
      return `/cabinet/wizard/${this.$route.params.idWizard}${item.list ? `/list/55/0/` : `/55/0/`}${item.idItem}/${
        this.$route.params.idCard
      }/${this.rels.split("|")[item.order - 1]}`;
    },

    geForceNextStep(params = this.$route.params) {
      if (this.$store.getters["wizard/getForceUpdate"]) {
        const { idWizard, idItem } = params;
        const wizardCursor = this.$store.getters["menu/getMenuById"](idWizard)?.WIZARDCUR;
        const currentIndex = wizardCursor?.find((item) => item.NITEM === Number(idItem))?.NORDER ?? Infinity;

        return this.tabs.find((item) => item.order > currentIndex) ?? null;
      }

      return null;
    },

    async goNext(e) {
      this.$store.dispatch("wizard/isWizardButtonsLoading", true);

      if (!this.currentTab?.list) {
        if (this.$store.getters["data_card/getBtnSave"]) {
          if (this.$refs.child.$refs.cardEditor !== undefined) {
            this.$store.commit("data_card/setValueByName", {
              name: "Continue",
              value: "CLICKED",
            });
            await this.$refs.child.$refs.cardEditor.saveDataCard();
            if (this.isSavedError === true) {
              this.$store.dispatch("wizard/isWizardButtonsLoading", false);
              return;
            }
            await this.$store.dispatch("wizard/fetchWizard", this.$route?.params);
            this.$store.commit("data_card/setValueByName", {
              name: "Continue",
              value: null,
            });
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
      const nextStep = this.geForceNextStep() ?? e;

      await this.$store.dispatch("menu/fetchMenuById", nextStep);

      const settingsTab = this.$store.getters["menu/getSettingsByIdItem"](nextStep.idItem || {});

      if (settingsTab.isModal) {
        const params = {
          idWizard: this.$route.params.idWizard,
          idModule: this.$route.params.idModule,
          idItem: nextStep.idItem,
          idCard: this.$route.params.idCard,
          idRel: this.rels.split("|")[nextStep.order - 1],
          title: nextStep.name,
          okTitle: "Далее",
        };
        this.getURL("nextStep", nextStep);
        const result = await this.$cardModal.open(params);
        if (result.ok) {
          this.$router.push(this.getURL(this.geForceNextStep(params)));
        }
        return;
      }
      this.$router.push(this.getURL(nextStep));
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
