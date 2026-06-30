<template>
  <div>
    <BrandLoader url="/img/loader.json" />
    <ProgressBar
      v-if="isShowProgressBar && isDataLoaded"
      :wizard-cursor="wizardCursor"
      :wizard-rels="wizardRELS"
      :wizard-i-d-c-a-r-d-s="wizardIDCARDS"
      :wizard-navigation="wizardNavigation"
      @update="updateStep"
    />
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
      <div
        v-show="shouldShowError"
        class="mt-3 mb-0 alert alert-danger"
        v-html="getErrorMessage"
      ></div>
    </div>
    <div
      v-if="getBtnSave && isShowButtonSave && !getError && !this.params.idWizard"
      class="row mt-4 ml-2"
    >
      <button
        :disabled="isSaving"
        type="button"
        class="btn btn-success col-12 col-md-auto mt-3 mt-md-0 btn-lg"
        :style="isButtonDisabled"
        @click="saveCard()"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<script>
import vMaska from "maska";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
import Form from "@/components/Libs/Form/Form";
import FormBlock from "@/components/Libs/Form/FormBlock";
import BrandLoader from "@/components/Libs/Controls/ControlBrandLoader/BrandLoader";
// eslint-disable-next-line import/no-absolute-path,  import/extensions
import { validateWithMask } from "@/store/data_card.helpers";
import { isCaptchaNeeded } from "./isCaptchaNeeded";
// eslint-disable-next-line import/no-absolute-path,  import/extensions
import { getParams, saveCookies, setURLParams } from "./helpers";
import ProgressBar from "./ProgressBar/ProgressBar";
import progressBarDemo from "./ProgressBar/progressBar.demo";
import { PROGRESS_BAR_CARDS_ID, PROGRESS_BAR_ZONES } from "./cardEditorConst";
import { TOKEN_NAME, OSAGO_WIZARD_MODULE_ID } from "./helpers.fixtures";
import { registerZoneInterceptor } from "./cardEditorZoneInterceptor";

const INVALID_FORM_MESSAGE = "Проверьте правильность заполнения формы!";

export default {
  name: "CardEditor",
  components: { ProgressBar, FormBlock, Form, BrandLoader },
  directives: {
    maska: vMaska,
  },
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
      default: null,
    },
    wizardId: {
      type: Number,
      default: null,
    },
    rel: {
      type: String,
      default: null,
    },
    zone: {
      type: String,
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
        zone: this.zone || "free",
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
    shouldShowError() {
      return this.getSavedError && !this.isAuthModelActive && this.getErrorMessage;
    },
    getZone() {
      return this.params.zone;
    },
    isDataLoaded() {
      return !this.getLoading && this.getForm?.length;
    },
    isShowLoader() {
      return (this.getLoading || this.isSaving || this.getIsWizardButtonsLoading) && this.params.idWizard;
    },
    progressBarDemo() {
      return progressBarDemo;
    },
    isAuthModelActive() {
      return this.$store.getters["data_card/getAuthModalVisible"];
    },
    getErrorMessage() {
      if (this.isAuthModelActive) {
        return "";
      }
      return this.$store.getters["data_card/getErrorMessage"];
    },
    ...mapGetters("data_card", [
      "getForm",
      "getFormParams",
      "getError",
      "getSavedError",
      "getBtnSave",
      "getDataFieldByFieldId",
      "getLoading",
    ]),
    ...mapGetters("wizard", ["getIsWizardButtonsLoading"]),
    isReadOnly() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isBlock() {
      return this.$store.getters["menu/getMenuById"](this.params.idItem)?.LUSEBLOCK;
    },
    wizardRELS() {
      if (this.params.idWizard) {
        const stringWizardRELS = this.$store.getters["wizard/getWizard"]?.REL;
        if (stringWizardRELS) {
          return stringWizardRELS.split("|");
        }
      }
      return this.progressBarDemo.wizardRels;
    },
    wizardCursor() {
      if (this.params.idWizard) {
        return this.$store.getters["menu/getMenuById"](this.params.idWizard)?.WIZARDCUR;
      }
      return this.progressBarDemo.wizardCursor;
    },
    wizardIDCARDS() {
      if (this.params.idWizard) {
        const stringWizardCARDS = this.$store.getters["wizard/getWizardPages"];
        if (stringWizardCARDS) {
          return stringWizardCARDS.split(";").map(Number);
        }
      }
      return this.progressBarDemo.wizardIDCARDS;
    },
    wizardNavigation() {
      if (this.params.idWizard && this.wizardIDCARDS) {
        const currentCardId = Number(this.params.idItem);
        const currentCardIndex = this.wizardIDCARDS.findIndex((card) => card === currentCardId);
        const nextCardId = this.wizardIDCARDS[currentCardIndex + 1];
        const backCardId = this.wizardIDCARDS[currentCardIndex - 1];
        const nextWizardCursor = this.wizardCursor?.find((item) => item.NITEM === nextCardId);
        const backWizardCursor = this.wizardCursor?.find((item) => item.NITEM === backCardId);
        const currentWizardCursor = this.wizardCursor?.find((item) => item.NITEM === currentCardId);
        if (this.wizardRELS) {
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
      }
      return this.progressBarDemo.wizardNavigation;
    },
    eventLocalHandler() {
      return () => import(`@/components/EventHandler/${this.params.idItem}/eventHandler`);
    },
    isCaptchaNeededCheck() {
      return this.isCaptchaNeeded;
    },
    isShowProgressBar() {
      return PROGRESS_BAR_CARDS_ID.includes(this.menuId) && PROGRESS_BAR_ZONES.includes(this.zone);
    },
  },

  watch: {
    isCaptchaNeededCheck() {
      this.$store.commit("data_card/saveButtonClicked", true);
      this.$store.commit("data_card/setUpdateEvent", this.captchaIsDemandedNow);
    },

    isShowProgressBar: {
      immediate: true,
      handler(val) {
        this.$store.commit("ui/loader/setShowLoader", val);
      },
    },
  },

  created() {
    this.init();
  },
  beforeUnmount() {
    this.$store.commit("data_card/clearDictionariesUrls");
  },
  methods: {
    async init() {
      try {
        this.isSaving = true;
        this.params = getParams({ ...this.$props });

        this.disableLoader();
        registerZoneInterceptor(this.$axios);

        if (process?.env?.NODE_ENV === "development" || process?.env?.NODE_ENV === "production" || this.params.cache) {
          this.eventHandler = await this.loadScript();
          this.initHandler = await this.loadInitScript();
        }
        const token = Cookies.get(TOKEN_NAME);
        if (token) {
          this.$axios.defaults.headers.common.Authorization = token;
        }
        await Promise.all([await this.$store.dispatch("menu/fetchMenuById", this.params), this.fetchCard()]).catch(
          (e) => {
            console.error(e);
          }
        );
        this.setting = this.$store.getters["menu/getSettingsByIdItem"](this.params.idItem);
        this.isShowButtonSave = true;
        this.params.cache = false;
        if (typeof this.initHandler === "function") {
          this.$store.commit(
            "data_card/setForm",
            this.initHandler(
              this.getForm.map((a) => ({ ...a })),
              { ...this.params, edit: this.edit }
            )
          );
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
      } finally {
        this.isSaving = false;
        this.$store.commit("data_card/setLoading", false);
        this.$store.commit("data_card/setDisabled", false);
      }
    },
    errorFillFormLogOsago() {
      if (this.params.idWizard === OSAGO_WIZARD_MODULE_ID) {
        const normalizedJSON = this.getForm.map((item) => ({
          [item.name]: item.value ?? null,
        }));
        const dataJSONString = JSON.stringify(normalizedJSON);
        this.$LogEvent({
          formName: "ОСАГО",
          idEventType: 1704,
          controlName: "CardEditor.vue",
          message: `
            IDITEM:${this.params.idItem}
            IDDATA:${this.params.idCard}
            SRESULT: ${INVALID_FORM_MESSAGE}
            timeUser: ${new Date()}
            JSON: ${dataJSONString}
            `,
        });
      }
    },
    disableLoader() {
      const params = new URLSearchParams(window.location.search.toLowerCase());

      if ([1105, 1124, 1037].includes(this.menuId)) {
        this.$store.commit("ui/loader/setShowLoader", params.get("id") ?? false);
      }
    },
    async goNext() {
      const currentCardId = Number(this.params.idItem);
      if (this.validateData(this.getForm)) {
        this.$store.commit("data_card/setValueByName", {
          name: "Save",
          value: null,
        });
        this.$store.commit("data_card/setValueByName", {
          name: "Continue",
          value: "CLICKED",
        });

        await this.saveCard();
        if (!this.getSavedError) {
          // Если следующий шаг визарда помечен как модальный (isModal),
          // открываем его в CardModal вместо перехода на отдельную страницу
          const nextStep = this.wizardNavigation?.next;
          if (nextStep?.IDCARD && (await this.openWizardStepAsModal(nextStep))) {
            return;
          }

          const findWizardSteps = this.$store.getters["data_card/getForm"]?.find(
            (item) => item.name === "BWIZARDSTEPS"
          );

          if (findWizardSteps?.value === true) {
            this.$store.commit("wizard/setForceUpdate", true, { root: true });

            await this.$store.dispatch(
              "wizard/fetchWizard",
              this.params.zone === "token" ? this.params : getParams({ ...this.props })
            );

            if (Number(currentCardId) !== this.wizardNavigation.current.IDCARD) {
              setURLParams(this.wizardNavigation.current);
            } else {
              setURLParams(this.wizardNavigation.next);
            }
          } else if (this.wizardNavigation?.next) {
            setURLParams(this.wizardNavigation.next);
          }

          if (Cookies.get(TOKEN_NAME) && this.params.zone === "free") {
            this.$store.commit("menu/setFlatMenu", []);
            this.$store.commit("wizard/setForceUpdate", true);
            this.params.zone = "token";
          }

          await this.init();
        }
      } else {
        this.$store.commit("data_card/setSavedError", true);
        this.errorFillFormLogOsago();
        this.$store.commit("data_card/setErrorMessage", {
          MESSAGE: INVALID_FORM_MESSAGE,
        });
      }
    },
    goBack() {
      if (this.wizardNavigation.back) {
        setURLParams(this.wizardNavigation.back);
        this.init();
      }
    },

    async openWizardStepAsModal(nextStep) {
      await this.$store.dispatch("menu/fetchMenuById", {
        idItem: nextStep.IDCARD,
        idModule: this.params.idModule,
        idWizard: this.params.idWizard,
        zone: this.params.zone,
      });

      const settings = this.$store.getters["menu/getSettingsByIdItem"](nextStep.IDCARD);
      if (!settings?.isModal) {
        return false;
      }

      const result = await this.$cardModal.open({
        idWizard: this.params.idWizard,
        idModule: this.params.idModule,
        idItem: nextStep.IDCARD,
        idRel: nextStep.REL,
        title: settings.name,
        idCard: this.params.idCard,
        okTitle: "Далее",
        zone: this.params.zone,
      });

      if (result.ok) {
        this.goToStepAfterModal(nextStep.IDCARD);
      }

      return true;
    },

    goToStepAfterModal(modalCardId) {
      const ids = this.wizardIDCARDS || [];
      const afterId = ids[ids.indexOf(modalCardId) + 1];

      if (!afterId) {
        return;
      }

      const cursor = this.wizardCursor?.find((item) => item.NITEM === afterId);

      setURLParams({
        REL: cursor ? this.wizardRELS[cursor.NORDER - 1] : undefined,
        IDCARD: afterId,
      });
      this.init();
    },

    updateStep(ev) {
      if (ev) {
        this.backToPage(ev);
      }
    },

    backToPage(cardId) {
      const navigation = this.getNavigationPositionByCardId(cardId);

      if (navigation) {
        setURLParams(navigation);
        this.init();
      }
    },
    getNavigationPositionByCardId(cardId) {
      const currentWizardCursor = this.wizardCursor.find((item) => item.NITEM === cardId);

      return {
        REL: this.wizardRELS[currentWizardCursor.NORDER],
        IDCARD: cardId,
      };
    },
    async wizardSave(e) {
      if (e === "Save") {
        this.$store.commit("data_card/setValueByName", {
          name: "Save",
          value: "CLICKED",
        });
      }
      await this.saveCard({}, "wizardSave");

      if ((!this.params.idWizard && !this.getSavedError) || (e === "Auth" && !this.getSavedError)) {
        this.$store.commit("menu/setFlatMenu", []);
        await this.init();
      }
    },
    scrollToError() {
      const divWithInvalidClass = document.getElementsByClassName("is-invalid")[0];

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

      if (!data?.length) {
        return valid;
      }

      for (let i = 0; i < data.length; i++) {
        const { mask, error, required, type, value: rawValue, visible, hidden } = data[i];
        const value = data[i].type === "enum" ? rawValue?.value : rawValue;
        const isStringWithMask = Boolean(mask) && type === "string";
        const isRequiredAccept = required && type === "boolean" && !hidden && visible && !value;

        if (
          isRequiredAccept ||
          (data[i].required &&
            !data[i].hidden &&
            data[i].visible &&
            !isStringWithMask &&
            (value === null || value === undefined || value === "") &&
            value !== 0) ||
          (error && data[i].visible)
        ) {
          valid = false;

          this.$store.commit("data_card/setFormField", data[i]);
          this.$store.commit("data_card/saveButtonClicked", false);
        }

        if (isStringWithMask && data[i].visible) {
          if (data[i].required && !value) {
            valid = false;
          }
          if (!validateWithMask(value, data[i].mask) && value) {
            valid = false;
          }
          this.$store.commit("data_card/setFormField", data[i]);
        }
      }
      const fieldOneToMany = data.find((item) => item.type === "OneToMany");

      if (fieldOneToMany && fieldOneToMany.visible) {
        const groupData = fieldOneToMany.value.flat(Infinity);
        const fieldTarget = groupData.find((item) => {
          const isEmptyValue = item.value === null || item.value === undefined || item.value === "";
          const isZeroValue = item.value === 0;
          const isRequiredAndVisible = item.required && item.visible;
          const isRequiredFieldMissing = isRequiredAndVisible && isEmptyValue && !isZeroValue;
          const hasValidationIssue = item.error && item.visible;

          return isRequiredFieldMissing || hasValidationIssue;
        });

        if (fieldTarget) {
          valid = false;

          const onlyRequired = groupData.filter((item) => item.required);

          for (let i = 0; onlyRequired.length > i; i++) {
            this.$store.commit("data_card/setFormField", onlyRequired[i]);
            this.$store.commit("data_card/saveButtonClicked", false);
          }
        }
      }

      return valid;
    },
    async saveCard(e = {}, action = null) {
      await this.callScript(e, "beforeSave");
      const isReCaptchaNeededBeforeSave = isCaptchaNeeded(this.getForm);
      const isValid = action === "wizardSave" ? true : this.validateData(this.getForm);

      if (isValid) {
        this.isShowSavedError = false;
        const { moduleId } = this;
        const itemId = this.params.idItem;
        const cardId = this.params.idCard;
        const relId = this.params.idRel;
        const isUploaderFieldValueExist = this.getForm.find(
          (elem) => ["Uploader", "uploadFiles"].includes(elem.type) && elem.value !== undefined
        );
        const storeAction = isUploaderFieldValueExist === undefined ? "saveDataCard" : "saveDataCardUploaders";
        const resp = await this.$store.dispatch(`data_card/${storeAction}`, {
          moduleId,
          itemId,
          cardId,
          relId,
          zone: this.getZone,
          form: this.getForm,
        });
        if (resp.status === 200) {
          const currentCard = resp.data[0]?.IDCARD === this.params.idItem;
          if (resp.data[0]?.ID && currentCard) {
            this.params.idCard = resp.data[0].ID;
          }
          if (resp.data[0]?.REL && currentCard) {
            this.params.idRel = resp.data[0].REL;
          }
          if (resp.data[0].ACTION !== "redirect") {
            setURLParams(resp.data[0]);
          }
          if (resp.data[0].ACCESS_TOKEN) {
            saveCookies(resp.data[0].ACCESS_TOKEN, resp.data[0].REFRESH_TOKEN);
            this.emitUserLoggedInEvent();
          }
          if ((resp.data[0].ACTION !== "redirect" || action === "wizardSave") && !resp.data[0]?.SURL) {
            const isLoginRequest = Boolean(resp.data[0]?.ACCESS_TOKEN);

            if (!isLoginRequest) {
              const body = {
                ...this.params,
                zone: this.getZone,
                query: this.getQueryParams(),
              };

              await this.$store.dispatch("data_card/fetchForm", body);
              const isReCaptchaNeededAfterSave = isCaptchaNeeded(this.getForm);

              if (isReCaptchaNeededBeforeSave !== isReCaptchaNeededAfterSave) {
                await this.callScript(e, "beforeSave");

                this.captchaIsDemandedNow = e;
                this.isCaptchaNeeded = true;

                return;
              }
            }
            await this.callScript(
              {
                ...e,
                resp,
              },
              "afterSave"
            );
          }
          if (resp.data[0]?.SURL) {
            await this.init();
          }
          const menu = this.$store.getters["menu/flatmenu"].find((item) => item.IDITEM === Number(this.params.idItem));
          const getSaveButton = menu?.ACTIONSCUR.find((item) => item.NTYPE === 38);
          const isActionSaveCard = getSaveButton ? Object.keys(getSaveButton).length : 0;
          const wizardSave = action === "wizardSave";

          if (this.params.idCard && isActionSaveCard && wizardSave) {
            this.params = getParams({ ...this.$props });
            await Promise.all([await this.$store.dispatch("menu/fetchMenuById", this.params), this.fetchCard()]).catch(
              (e) => {
                console.error(e);
              }
            );
          }
          if (resp.data[0].ACTION === "redirect") {
            window.location.href = resp.data[0].SURL;
          }
        }
        if (resp.status === 520 && resp?.data?.MESSAGE) {
          await this.callScript(
            {
              ...e,
              resp,
            },
            "afterSave"
          );

          this.emitUserLoggedInEvent();
        }
        if (resp.status === 500) {
          this.emitUserLoggedInEvent();
        }
      } else {
        this.errorFillFormLogOsago();
        this.$store.commit("data_card/setSavedError", true);
        this.$store.commit("data_card/setErrorMessage", {
          MESSAGE: INVALID_FORM_MESSAGE,
        });
      }
    },
    async callScript(e, action = null) {
      if (typeof this.eventHandler === "function") {
        const data = await this.eventHandler(
          this.getForm.map((a) => ({ ...a })),
          e,
          action
        );
        if (data) {
          this.$store.commit("data_card/setForm", data || this.getForm);
        }
      }
    },
    async fetchCard() {
      if (!this.cardId && this.cardId !== 0) {
        const { items } = await this.$store.dispatch("data_card/fetchList", this.params);

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
        this.params.idRel = this.wizardNavigation.current?.REL;
      }

      await this.$store.dispatch("data_card/fetchForm", { ...this.params, query: this.getQueryParams() });
      const findWizardSteps = this.$store.getters["data_card/getForm"]?.find((item) => item.name === "BWIZARDSTEPS");

      if (findWizardSteps) {
        this.$store.commit("wizard/setForceUpdate", true, { root: true });
        await this.$store.dispatch("wizard/fetchWizard", this.params);
        this.$store.commit("wizard/setForceUpdate", false, { root: true });
      }
    },
    isLikeSQL(s) {
      return /const|select/i.test(s);
    },
    getConfirmOptionsForAction(action) {
      const opts = {
        needsConfirm: false,
        question: `Вы действительно хотите выполнить действие "${action.SNAME}"?`,
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
        zone: this.getZone,
      });
      const field = this.getForm.find((f) => f.fieldId === e.fieldId);
      const menu = this.$store.getters["menu/flatmenu"].find((item) => item.IDITEM === Number(this.params.idItem));

      await this.callScript(e, this.callbackAction);

      if (field.type === "button" && e.action) {
        const actionId = parseInt(e.value.replace("Item", ""), 10);
        const actionRefreshCard = menu.ACTIONSCUR.find((item) => item.NTYPE === 39 && item.ID === actionId);
        const actionSaveCard = menu.ACTIONSCUR.find((item) => item.NTYPE === 38 && item.ID === actionId);
        const actionExecute = menu.ACTIONSCUR.find(
          (item) => (item.NTYPE === 4 || item.NTYPE === 56) && item.ID === actionId
        );
        if (actionSaveCard?.ID === actionId) {
          this.$store.commit("data_card/saveButtonClicked", true);
          await this.saveCard(e, this.params.idWizard ? "wizardSave" : null);
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
            zone: this.getZone,
          });

          this.$store.commit("data_card/setFetchingAction", {
            actionId,
            isFetching: true,
          });

          const response = await this.$store.dispatch("data_card/executeAction", {
            actionId: actionExecute?.ID,
            relActionId: actionExecute?.REL,
            relId: this.params.idRel,
            rowId: this.params.idCard,
            body: this.$store.getters["data_card/getActionParams"],
            zone: this.getZone,
          });

          this.$store.commit("data_card/setFetchingAction", {
            actionId,
            isFetching: false,
          });

          if (response?.status === 200) {
            if (response.data.POUTVALUE) {
              if (response.data.POUTVALUE.includes("/")) {
                window.open(response.data.POUTVALUE, actionExecute?.LCURWINDOW ? "_self" : "_blank");
              }
            }
            if (actionExecute?.LREFRESH) {
              this.$store.commit("uploader/removeAllNewFiles", null);
              this.$store.commit("uploader/setFileErrors", []);

              await this.$store.dispatch("data_card/fetchForm", { ...this.params, query: this.getQueryParams() });
              await this.$store.dispatch("uploader/fetchData", this.params);
              await this.callScript(e, this.callbackAction);
            }
          }
        }
      }
    },
    updateBlurValue($event) {
      this.callScript($event, $event);
    },
    emitUserLoggedInEvent() {
      window.dispatchEvent(new CustomEvent("user-logged-in", { detail: true }));
    },
    getQueryParams() {
      const search = new URLSearchParams(window.location.search).entries();
      const result = {};

      for (const [key, value] of search) {
        result[key] = value;
      }

      return result;
    },
  },
};
</script>

<style scoped></style>
