<template>
  <div>
    <ProgressBar
      :wizard-cursor="wizardCursor"
      :wizard-rels="wizardRELS"
      :wizard-i-d-c-a-r-d-s="wizardIDCARDS"
      :wizard-navigation="wizardNavigation"
      @update="updateStep"
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
      // TODO убрать хардкод вернуть возврат пустого массива
      // return [];
      return [{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Тип расчета","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":false,"LEDIT":true,"NORDER":1,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12798,"LFIRSTLOADRECORD":true,"IDITEM":1037,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Тип расчета","NORDER":1,"LOPENLIST":false,"ID":4528,"NITEMPARENTMENU":1036,"NITEM":1037,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Данные об авто","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":2,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12799,"LFIRSTLOADRECORD":true,"IDITEM":1039,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Данные об авто","NORDER":2,"LOPENLIST":false,"ID":4530,"NITEMPARENTMENU":1036,"NITEM":1039,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Расчет","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":3,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12800,"LFIRSTLOADRECORD":true,"IDITEM":1040,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Расчет","NORDER":3,"LOPENLIST":false,"ID":4526,"NITEMPARENTMENU":1036,"NITEM":1040,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Личные данные","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":false,"LEDIT":true,"NORDER":4,"LNOTCARD":false,"ACTIONSCUR":[{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1041,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":true,"LINLIST":false,"LOUTPARAM":false,"LWITHCOMMIT":false,"ID":45576,"LCURWINDOW":true,"LMULTISELECT":false,"SCONST":"Mobile.ClientUtils.SendEmail","SNAME":"Получить код","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"FB79C94372FD7F0530D8A6E43BDA9022","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false}],"ID":12801,"LFIRSTLOADRECORD":true,"IDITEM":1041,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Личные данные","NORDER":4,"LOPENLIST":false,"ID":4529,"NITEMPARENTMENU":1036,"NITEM":1041,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Данные о ТС","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":5,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12805,"LFIRSTLOADRECORD":true,"IDITEM":1064,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Сведения о ТС","NORDER":5,"LOPENLIST":false,"ID":4527,"NITEMPARENTMENU":1036,"NITEM":1064,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Доп сведения о ТС","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":6,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12806,"LFIRSTLOADRECORD":true,"IDITEM":1065,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Доп сведения о ТС","NORDER":6,"LOPENLIST":false,"ID":4538,"NITEMPARENTMENU":1036,"NITEM":1065,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Документы ТС","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":7,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12807,"LFIRSTLOADRECORD":true,"IDITEM":1066,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Документы ТС","NORDER":7,"LOPENLIST":false,"ID":4531,"NITEMPARENTMENU":1036,"NITEM":1066,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Водители","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":8,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12808,"LFIRSTLOADRECORD":true,"IDITEM":1068,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Водители","NORDER":8,"LOPENLIST":false,"ID":4532,"NITEMPARENTMENU":1036,"NITEM":1068,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Параметры полиса","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":9,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12810,"LFIRSTLOADRECORD":true,"IDITEM":1069,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":true}],"SNAME":"Параметры полиса","NORDER":9,"LOPENLIST":false,"ID":4533,"NITEMPARENTMENU":1036,"NITEM":1069,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Точный расчет","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":10,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12811,"LFIRSTLOADRECORD":true,"IDITEM":1070,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Точный расчет","NORDER":10,"LOPENLIST":false,"ID":4534,"NITEMPARENTMENU":1036,"NITEM":1070,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Сканы документов","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":false,"LEDIT":true,"NORDER":11,"LNOTCARD":false,"ACTIONSCUR":[],"ID":12802,"LFIRSTLOADRECORD":true,"IDITEM":1048,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Сканы документов","NORDER":11,"LOPENLIST":false,"ID":4535,"NITEMPARENTMENU":1036,"NITEM":1048,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Осмотр","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":false,"LEDIT":true,"NORDER":12,"LNOTCARD":false,"ACTIONSCUR":[{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1049,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45577,"LCURWINDOW":true,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenIns","SNAME":"Изменить данные заявки","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":true,"REL":"B834BA52B5F73A020FBDE952B821DF4B","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":true,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1049,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45578,"LCURWINDOW":true,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.UpdateIns","SNAME":"Принять","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":true,"REL":"E372EBAA89ED7A00C826A8EA7E98732C","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":true,"LTOOLBAR":false}],"ID":12803,"LFIRSTLOADRECORD":true,"IDITEM":1049,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Осмотр","NORDER":12,"LOPENLIST":false,"ID":4536,"NITEMPARENTMENU":1036,"NITEM":1049,"IDADMMODULE":55},{"MENUCUR":[{"LDELETE":false,"IDADMMENUTYPE":9,"SNAME":"Оплата","LMODALFORMSTYLE":false,"NONETOMANY":0,"LNEW":true,"LEDIT":true,"NORDER":13,"LNOTCARD":false,"ACTIONSCUR":[{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45834,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenPrintKidNSLinkButton","SNAME":"Скачать КИД НС","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"0F1424F50FD7C6A9D7854C0271371104","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45837,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenPrintKidRAPLinkButton","SNAME":"Скачать КИД РАП","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"E5F70412556368D1C8E212E6DEF2ECBC","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45833,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.GetLinkRules","SNAME":"Правила страхования","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"5B0A7D6CFD3ECBDD1DC036A5BAE99225","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45579,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenPrintKidLinkButton","SNAME":"Скачать КИД","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"AC2C8D09F680639348034D0C06229DC6","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45580,"LCURWINDOW":true,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenExactCalc","SNAME":"Внести изменения","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"A92966E7F930CAAD68F389CC95A50AB9","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":true,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":false,"LWITHCOMMIT":false,"ID":45581,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.Refresh","SNAME":"Обновить статус оплаты","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":true,"REL":"454F5B84D80ADF63C3A6318843F43786","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45582,"LCURWINDOW":false,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenPrintLinkButton","SNAME":"Распечатать проект полиса","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":false,"REL":"5EB5DF6FECFDCA8FB3A658B35F598740","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false},{"LUSEINCARD":true,"LIDLIST":false,"LSELECTDEFAULT":false,"LINBUTTONS":false,"NITEM":1085,"LCREATEBUTTON":false,"LCHECKACCESS":false,"LFROMDATASET":false,"LINLIST":false,"LOUTPARAM":true,"LWITHCOMMIT":false,"ID":45583,"LCURWINDOW":true,"LMULTISELECT":false,"SCONST":"v4.cascoutils_web.OpenPayLinkButton","SNAME":"Оплатить полис","LFREEZONE":false,"LREQUESTCODE":false,"LCLOSEAFTER":false,"LINACTIONS":true,"LREFRESH":true,"REL":"EAA1604FA40072C03076500D6F832B7C","SFIELD":"id","NTYPE":4,"LHIDEDLG":true,"IDADMMODULE":55,"LNEEDPARAM":false,"LHIDEINLIST":false,"LTOOLBAR":false}],"ID":12813,"LFIRSTLOADRECORD":true,"IDITEM":1085,"ONETOMANYCUR":[],"IDPARENT":0,"LPRINT":false,"LNEWRECORDMETHOD":false}],"SNAME":"Оплата","NORDER":13,"LOPENLIST":false,"ID":4537,"NITEMPARENTMENU":1036,"NITEM":1085,"IDADMMODULE":55}]
    },
    wizardIDCARDS() {
      if (this.params.idWizard) {
        const stringWizardCARDS = this.$store.getters["wizard/getWizardPages"];
        if (stringWizardCARDS) {
          return stringWizardCARDS.split(";").map(Number);
        }
      }
      // TODO убрать хардкод вернуть возврат пустого массива
      // return [];
      return [1,2,3,4,5]
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
      // TODO удалить хардкод вернуть возврат пустого объекта
      // return {};
      return {
        REL: `123124123aaa123`,
        IDCARD: 1040,
      }
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
        if (this.wizardNavigation?.back) {
          setURLParams(this.wizardNavigation.back);
        }
        this.init();
      }
    },
    wizardSave() {
      this.$store.commit("data_card/setValueByName", {
        name: "Save",
        value: "CLICKED",
      });
      this.saveCard(null, "wizardSave");
    },
    next() {
      const url = new URL(window.location.href);
      url.searchParams.set("ID", "857");
      url.searchParams.set("REL", "CE5997B2963ED6CC5754A3E54C1A5542");
      url.searchParams.set("IDMENU", "1093");
      window.history.replaceState(null, null, url);
      this.init();
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
          if (resp.data[0].ACTION !== "redirect" && !resp.data[0].IDWIZARD) {
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
          if (resp.data[0].IDWIZARD) {
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
    updateStep(ev) {
      this.params.idItem = ev;
    }
  },
};
</script>

<style scoped></style>
