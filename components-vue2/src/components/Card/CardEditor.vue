<template>
  <div>
    <Progress-bar
      :wizard-cursor="wizardCursor"
      :wizard-rels="wizardRELS"
      :wizard-i-d-c-a-r-d-s="wizardIDCARDS"
      :wizard-navigation="wizardNavigation"
    />
    <div v-if="isSaving">Загрузка...</div>
    <FormBlock
      v-if="isBlock && !isSaving"
      :data="getForm"
      :edit="!isReadOnly"
      :params="params"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
      @goNext="goNext($event)"
      @goBack="goBack($event)"
      @saveCard="wizardSave($event)"
    />
    <Form
      v-if="!isBlock && !getError"
      :data="getForm"
      :params="params"
      :edit="!isReadOnly"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
    />

    <div>
      <b-alert :show="getSavedError" variant="danger" class="mt-3 mb-0">
        {{ getErrorMessage }}
      </b-alert>
    </div>
    <div
      v-if="
        getBtnSave && isShowButtonSave && !getError && !this.params.idWizard
      "
      class="row mt-4 ml-2"
    >
      <button
        pill
        :disabled="isSaving"
        :class="'btn-lg'"
        type="button"
        class="btn btn-success col-12 col-md-auto mt-3 mt-md-0"
        :style="isButtonDisabled"
        @click="saveCard()"
      >
        Сохранить
        <span
          role="status"
          v-if="isSaving"
          style="width: 1rem; height: 1rem"
          class="spinner-border text-danger ml-2"
        >
          <span class="sr-only">Spinning</span>
        </span>
      </button>
    </div>
    <div>
      <!--      <button-->
      <!--        pill-->
      <!--        :disabled="isSaving"-->
      <!--        :class="'btn-lg'"-->
      <!--        type="button"-->
      <!--        class="btn btn-success col-12 col-md-auto mt-3 mt-md-0"-->
      <!--        @click="next()"-->
      <!--      >-->
      <!--        Далее (тест)-->
      <!--        <span-->
      <!--          role="status"-->
      <!--          style="width: 1rem; height: 1rem"-->
      <!--          class="spinner-border text-danger ml-2"-->
      <!--        >-->
      <!--          <span class="sr-only">Spinning</span>-->
      <!--        </span>-->
      <!--      </button>-->
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Form from "/../components/Libs/Form/Form.vue";
import FormBlock from "/../components/Libs/Form/FormBlock.vue";
import Vue from "vue";
import { IconsPlugin } from "bootstrap-vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import VueEasyTooltip from "vue-easy-tooltip";
import * as Sentry from "@sentry/vue";
import { isCaptchaNeeded } from "./isCaptchaNeeded";
import { isCriticalError } from "/../plugins/auth/toast.helper";
import { getParams, saveCookies, setURLParams } from "./helpers";
import ProgressBar from "./ProgressBar.vue";

Vue.use(LoadScript);
Vue.use(IconsPlugin);
Vue.component("VueEasyTooltip", VueEasyTooltip);
const TOKEN_NAME = "auth._token.local";

export default {
  name: "CardEditor",
  components: { ProgressBar, FormBlock, Form },
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
      default: null,
    },
    rel: {
      type: String,
      required: false,
      default: null,
    },
    zone: {
      type: String,
      required: false,
      default: "free",
    },
  },
  data() {
    return {
      params: {
        idItem: this.menuId,
        idModule: this.moduleId,
        idParent: "0",
        idCard: this.cardId,
        idRel: this.rel,
        zone: this.free || "free",
        cache: true,
      },
      isShowSavedError: false,
      eventHandler: null,
      isButtonDisabled: false,
      isSaving: false,
      isShowButtonSave: false,
      isCaptchaNeeded: null,
      captchaIsDemandedNow: false,
    };
  },
  computed: {
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getErrorMessage",
      "getSavedError",
      "getError",
      "getBtnSave",
      "getDataFieldByFieldId",
      "getLoading",
    ]),
    ...mapGetters("auth", ["getLogged", "getUser"]),
    isReadOnly() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isBlock() {
      return this.$store.getters["menu/getMenuById"](this.params.idItem)
        ?.LUSEBLOCK;
    },
    wizardRELS() {
      if (this.params.idWizard) {
        const stringWizardRELS = this.$store.getters["wizard/getWizard"]?.REL;
        if (stringWizardRELS) {
          return stringWizardRELS.split("|");
        }
      }
      return [];
    },
    wizardCursor() {
      if (this.params.idWizard) {
        return this.$store.getters["menu/getMenuById"](this.params.idWizard)
          ?.WIZARDCUR;
      }
      return [];
    },
    wizardIDCARDS() {
      if (this.params.idWizard) {
        const stringWizardCARDS = this.$store.getters["wizard/getWizardPages"];
        if (stringWizardCARDS) {
          return stringWizardCARDS.split(";").map(Number);
        }
      }
      return [];
    },
    wizardNavigation() {
      if (this.params.idWizard && this.wizardIDCARDS) {
        const currentCardId = Number(this.params.idItem);
        const currentCardIndex = this.wizardIDCARDS.findIndex(
          (card) => card === currentCardId
        );
        const nextCardId = this.wizardIDCARDS[currentCardIndex + 1];
        const backCardId = this.wizardIDCARDS[currentCardIndex - 1];
        const nextWizardCursor = this.wizardCursor.find(
          (item) => item.NITEM === nextCardId
        );
        const backWizardCursor = this.wizardCursor.find(
          (item) => item.NITEM === backCardId
        );
        const currentWizardCursor = this.wizardCursor.find(
          (item) => item.NITEM === currentCardId
        );
        if (this.wizardRELS)
          return {
            current: currentWizardCursor
              ? {
                  REL: this.wizardRELS[currentWizardCursor.NORDER - 1],
                  IDCARD: currentCardId,
                }
              : null,
            next: nextWizardCursor
              ? {
                  REL: this.wizardRELS[nextWizardCursor.NORDER - 1],
                  IDCARD: nextCardId,
                }
              : null,
            back: backWizardCursor
              ? {
                  REL: this.wizardRELS[backWizardCursor.NORDER - 1],
                  IDCARD: backCardId,
                }
              : null,
          };
      }
      return {};
    },
    eventLocalHandler() {
      return () =>
        import(
          `/../components/EventHandler/${this.params.idItem}/eventHandler`
        );
    },
    cacheDataLocal() {
      return () =>
        import(
          `./CacheDataLocal/${this.menuId}/cache${this.params.idItem}.json`
        );
    },
    isCaptchaNeededCheck() {
      return this.isCaptchaNeeded;
    },
  },

  watch: {
    isCaptchaNeededCheck() {
      this.$store.commit("data_card/saveButtonClicked", true);
      this.$store.commit("data_card/setUpdateEvent", this.captchaIsDemandedNow);
    },
  },

  created() {
    this.init();
  },
  methods: {
    async init() {
      try {
        this.params = getParams({ ...this.$props });
        if (
          process?.env?.NODE_ENV === "development" ||
          process?.env?.NODE_ENV === "production" ||
          this.params.cache
        ) {
          this.eventHandler = await this.loadScript();
          this.initHandler = await this.loadInitScript();
        }
        this.cacheDataLocal()
          .then((json) => {
            this.$store.commit(
              "data_card/setForm",
              Object.values(json.metaData.data)
            );
            this.$store.commit("setCaptions", json.metaData.captions);
            this.$store.commit("data_card/setBtnSave", json.metaData.btnSave);
            this.$store.commit("data_card/setReadOnly", json.metaData.readonly);
            this.$store.commit(
              "data_card/setCardCaption",
              json.metaData.cardCaption
            );
            this.$store.commit(
              "data_card/setVisible",
              Object.values(json.metaData.visible)
            );
            this.$store.commit(
              "data_card/setAddFields",
              Object.values(json.metaData.addFields)
            );
          })
          .catch((e) => console.warn(e));
        const token = Cookies.get(TOKEN_NAME);
        if (token) {
          this.$axios.defaults.headers.common.Authorization = token;
        }
        // if (process?.env?.NODE_ENV === "production") {
        //   await this.$loadScript(
        //     `/api/card/js/${this.moduleId}/${this.menuId}?zone=${
        //       this.zone
        //     }&time=${Date.now()}`
        //   )
        //     .then(() => {
        //       this.eventHandler =
        //         typeof eventHandler === "function" ? eventHandler : null;
        //     })
        //     .catch(async (e) => {
        //       console.error(e);
        //       this.eventHandler = await this.loadScript();
        //     });
        // }
        await Promise.all([
          await this.$store.dispatch("menu/fetchMenuById", this.params),
          this.fetchCard(),
        ]).catch((e) => {
          console.error(e);
          Sentry.captureException(
            new Error(e?.response?.data?.MESSAGE || e),
            (scope) => {
              scope.setTransactionName("Ошибка выполнения запроса.");
              return scope;
            }
          );
        });
        this.setting = this.$store.getters["menu/getSettingsByIdItem"](
          this.params.idItem
        );
        this.isShowButtonSave = true;
        this.params.cache = false;
        if (typeof this.initHandler === "function") {
          this.initHandler(this.getForm);
        }
      } catch (e) {
        console.error(e);
        if (this.menuId !== 777) {
          this.$store.commit("data_card/setError", true);
          this.$store.commit(
            "data_card/setErrorMessage",
            e?.response?.data || {
              MESSAGE: `Ошибка отображения компонента`,
            }
          );
        }
        Sentry.captureException(new Error(this.getErrorMessage), (scope) => {
          scope.setTransactionName(
            `Ошибка отображения компонента "${this.menuId} Текст ошибки: ${e}"`
          );
          return scope;
        });
      } finally {
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setDisabled", false);
      }
    },
    async goNext() {
      if (this.validateData(this.getForm)) {
        this.isSaving = true;
        await this.saveCard();
        if (!this.getSavedError) {
          if (this.wizardNavigation?.next) {
            setURLParams(this.wizardNavigation.next);
          }
          await this.init();
        }
        this.isSaving = false;
      }
    },
    goBack() {
      if (this.wizardNavigation.back) {
        setURLParams(this.wizardNavigation.back);
        this.init();
      }
    },
    wizardSave() {
      this.$store.commit("data_card/setValueByName", {
        name: "Save",
        value: "CLICKED",
      });
      this.saveCard({}, "wizardSave");
    },
    scrollToError() {
      const divWithInvalidClass =
        document.getElementsByClassName("is-invalid")[0];
      if (divWithInvalidClass) {
        const divWithControlClass = divWithInvalidClass.closest(".control");
        divWithControlClass.scrollIntoView();
      }
    },
    async loadScript() {
      return this.eventLocalHandler().then((script) => script.eventHandler);
    },
    async loadInitScript() {
      return this.eventLocalHandler().then((script) => script.initHandler);
    },
    async callbackAction(url) {
      try {
        this.$store.commit("data_card/setLoading", true);
        this.$store.commit("data_card/setDisabled", true);
        const { data } = await this.$axios.get(url);
        return data;
      } catch (e) {
        console.error(e);
      } finally {
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setDisabled", false);
      }
    },
    validateData(data) {
      let valid = true;
      for (let i = 0; i < data.length; i++) {
        const value =
          data[i].type === "enum" ? data[i].value.value : data[i].value;
        const { error } = data[i];
        if (
          (data[i].required &&
            !data[i].hidden &&
            data[i].visible &&
            (value === null || value === undefined || value === "") &&
            value !== 0) ||
          (error && data[i].visible)
        ) {
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
          this.$store.commit("data_card/saveButtonClicked", false);
        }
      }
      return valid;
    },
    async saveCard(e = {}, action = null) {
      await this.callScript(e, "beforeSave");
      const isReCapthcaNeededBeforeSave = isCaptchaNeeded(this.getForm);
      const isValid =
        action === "wizardSave" ? true : this.validateData(this.getForm);
      if (isValid) {
        this.isShowSavedError = false;
        const { moduleId } = this;
        const itemId = this.params.idItem;
        const cardId = this.params.idCard;
        const relId = this.params.idRel;
        const { zone } = this.params;
        const resp = await this.$store.dispatch("data_card/saveDataCard", {
          moduleId,
          itemId,
          cardId,
          relId,
          zone,
          form: this.getForm,
        });

        if (resp.status === 200) {
          if (
            (resp.data[0].ACTION !== "redirect" && !resp.data[0].IDWIZARD) ||
            action === "wizardSave"
          ) {
            await this.$store.dispatch("data_card/fetchForm", {
              ...this.params,
              zone,
            });
            const isReCapthcaNeededAfterSave = isCaptchaNeeded(this.getForm);
            if (isReCapthcaNeededBeforeSave !== isReCapthcaNeededAfterSave) {
              await this.callScript(e, "beforeSave");
              this.captchaIsDemandedNow = e;
              this.isCaptchaNeeded = true;
              return;
            }
            await this.callScript({ ...e, resp }, "afterSave");
          }
          if (resp.data[0].ACTION === "redirect") {
            window.location.href = resp.data[0].SURL;
          }
          if (resp.data[0].IDWIZARD && action !== "wizardSave") {
            setURLParams(resp.data[0]);
            if (resp.data[0].ACCESS_TOKEN) {
              saveCookies(
                resp.data[0].ACCESS_TOKEN,
                resp.data[0].REFRESH_TOKEN
              );
            }
          }
        }
        if (resp.status === 520 && resp?.data?.MESSAGE) {
          if (isCriticalError(resp?.data?.MESSAGE)) {
            Sentry.captureException(new Error(resp?.data?.MESSAGE), (scope) => {
              scope.setLevel("fatal");
              scope.setTransactionName(`Ошибка 520 компонента "${this.menuId}`);
              return scope;
            });
          }
        }
        if (resp.status === 500) {
          Sentry.captureException(new Error(resp?.data), (scope) => {
            scope.setLevel("fatal");
            scope.setTransactionName(`Ошибка 500 компонента "${this.menuId}"`);
            return scope;
          });
        }
      }
    },
    async callScript(e, action = null) {
      const data = await this.eventHandler(
        this.getForm.map((a) => ({ ...a })),
        e,
        action
      );
      if (data) {
        this.$store.commit("data_card/setForm", data || this.getForm);
      }
    },
    async fetchCard() {
      if (!this.cardId && this.cardId !== 0) {
        const { items } = await this.$store.dispatch(
          "data_card/fetchList",
          this.params
        );
        this.params.idCard = this.cardId || (items ? items[0].ID : 0);
        if (this.rel !== null && this.rel !== "0") {
          this.params.idRel = this.rel;
        } else {
          this.params.idRel = items ? items[0].REL : undefined;
        }
      } else {
        // this.params.idCard = 0;
        // this.params.idRel = undefined;
      }
      if (this.params.idWizard) {
        await this.$store.dispatch("wizard/fetchWizard", this.params);
        this.params.idRel = this.wizardNavigation.current.REL;
      }
      await this.$store.dispatch("data_card/fetchForm", this.params);
    },
    isLikeSQL(s) {
      return /const|select/i.test(s);
    },
    getConfirmOptionsForAction(action) {
      const opts = {
        needsConfirm: false,
        question: `Вы действительно хотите выполнить действие" ${action.SNAME}"?`,
        title: "Подтверждение выполнения действия",
        okTitle: "Да",
        cancelTitle: "Нет",
      };
      if (action.LHIDEDLG === false) {
        opts.needsConfirm = true;
      }
      if (action.SCAPTIONSQL && !this.isLikeSQL(action.SCAPTIONSQL)) {
        opts.question = action.SCAPTIONSQL;
      }
      if (action.ID === 39692) {
        opts.title = "Вы уверены?";
        opts.okTitle = "Да, вернуться на Госуслуги";
        opts.cancelTitle = "Нет, продолжить";
      }
      return opts;
    },
    async showConfirmActionDlg(opts) {
      return this.$bvModal
        .msgBoxConfirm(opts.question, {
          title: opts.title,
          size: "md",
          buttonSize: "md",
          okVariant: "success",
          okTitle: opts.okTitle,
          cancelTitle: opts.cancelTitle,
          footerClass: "p-2",
          hideHeaderClose: false,
          modalClass: ["cabinet"],
          centered: true,
        })
        .then((res) => res)
        .catch((err) => {
          console.error(err);
          return false;
        });
    },
    async goThroughConfirmStep(action) {
      const confStepOpts = this.getConfirmOptionsForAction(action);
      if (confStepOpts.needsConfirm) {
        return this.showConfirmActionDlg(confStepOpts);
      }
      return true;
    },

    async updateValue(e) {
      await this.$store.dispatch("data_card/setActionFormField", {
        fieldId: e.fieldId,
        name: e.name,
        value: e.value,
        action: e.action,
        zone: this.params.zone,
      });
      const field = this.getForm.find((f) => f.fieldId === e.fieldId);
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM === this.menuId
      );
      await this.callScript(e, this.callbackAction);
      if (field.type === "button" && e.action) {
        const actionId = parseInt(e.value.replace("Item", ""), 10);
        const actionRefreshCard = menu.ACTIONSCUR.find(
          (item) => item.NTYPE === 39 && item.ID === actionId
        );
        const actionSaveCard = menu.ACTIONSCUR.find(
          (item) => item.NTYPE === 38 && item.ID === actionId
        );
        const actionExecute = menu.ACTIONSCUR.find(
          (item) => item.NTYPE === 4 && item.ID === actionId
        );
        if (actionSaveCard?.ID === actionId) {
          this.$store.commit("data_card/saveButtonClicked", true);
          await this.saveCard(e);
          this.scrollToError();
          this.$store.commit("data_card/saveButtonClicked", false);
        }
        if (actionRefreshCard?.ID === actionId) {
          await this.fetchCard();
        }
        if (actionExecute?.ID === actionId) {
          if (!(await this.goThroughConfirmStep(actionExecute))) {
            return;
          }
          await this.$store.dispatch("data_card/fetchActionParams", {
            moduleId: this.params.idModule,
            actionId: parseInt(e.value.replace("Item", ""), 10),
            cardId: this.params.idCard,
            zone: this.zone,
          });
          const response = await this.$store.dispatch(
            "data_card/executeAction",
            {
              actionId: actionExecute?.ID,
              relActionId: actionExecute?.REL,
              relId: this.rel,
              rowId: this.cardId,
              body: this.$store.getters["data_card/getActionParams"],
              zone: this.zone,
            }
          );
          if (response?.status === 200) {
            if (response.data.POUTVALUE) {
              if (response.data.POUTVALUE.includes("/")) {
                window.open(
                  response.data.POUTVALUE,
                  actionExecute?.LCURWINDOW ? "_self" : "_blank"
                );
              }
            }
          }
          if (response.status === 520 && response?.data?.MESSAGE) {
            if (isCriticalError(response?.data?.MESSAGE)) {
              Sentry.captureException(
                new Error(response?.data?.MESSAGE),
                (scope) => {
                  scope.setLevel("error");
                  scope.setTransactionName(
                    `Ошибка 520 компонента "${this.menuId}"`
                  );
                  return scope;
                }
              );
            }
          }
          if (response?.status === 500) {
            Sentry.captureException(new Error(response?.data), (scope) => {
              scope.setLevel("fatal");
              scope.setTransactionName(
                `Ошибка 500 компонента "${this.menuId}"`
              );
              return scope;
            });
          }
        }
      }
    },
    updateBlurValue($event) {
      this.callScript($event, $event);
    },
  },
};
</script>

<style scoped></style>
