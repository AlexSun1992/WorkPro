<template>
  <div>
    <FormBlock
      v-if="isBlock"
      :data="getForm"
      :edit="!isReadOnly"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
    />

    <Form
      v-if="!isBlock"
      :data="getForm"
      :edit="!isReadOnly"
      @update="updateValue($event)"
      @blur="updateBlurValue($event)"
    />

    <div>
      <b-alert
        :show="getSavedError || getError"
        variant="danger"
        class="mt-3 mb-0"
      >
        {{ getErrorMessage }}
      </b-alert>
    </div>
    <div
      v-if="getBtnSave && isShowButtonSave && !getError"
      class="row mt-4 ml-2"
    >
      <b-button
        pill
        :disabled="isSaving"
        :class="'btn-lg'"
        type="button"
        variant="success"
        class="col-12 col-md-auto mt-3 mt-md-0"
        :style="isButtonDisabled"
        @click="saveCard()"
      >
        Сохранить
        <b-spinner
          v-if="isSaving"
          style="width: 1rem; height: 1rem"
          class="ml-2"
          variant="danger"
          label="Spinning"
        />
      </b-button>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import Form from "/../components/Libs/Form/Form.vue";
import FormBlock from "/../components/Libs/Form/FormBlock.vue";
import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import LoadScript from "vue-plugin-load-script";
import Cookies from "js-cookie";
import VueEasyTooltip from "vue-easy-tooltip";

Vue.use(LoadScript);
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.component("VueEasyTooltip", VueEasyTooltip);
const TOKEN_NAME = "auth._token.local";
export default {
  name: "CardEditor",
  components: { FormBlock, Form },
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
        idCard: "0",
        idRel: "0",
        zone: this.zone,
      },
      isShowSavedError: false,
      eventHandler: null,
      isButtonDisabled: false,
      isSaving: false,
      isShowButtonSave: false,
    };
  },
  async created() {
    try {
      const token = Cookies.get(TOKEN_NAME);
      if (token) {
        this.$axios.defaults.headers.common.Authorization = token;
      }
      if (process?.env?.NODE_ENV === "production") {
        await this.$loadScript(
          `/api/card/js/${this.moduleId}/${this.menuId}?zone=${
            this.zone
          }&time=${Date.now()}`
        );
        this.eventHandler =
          typeof eventHandler === "function" ? eventHandler : null;
      }
      if (process?.env?.NODE_ENV === "development") {
        this.eventHandler = await this.loadScript();
      }
      await this.$store.dispatch("menu/fetchMenu", this.params);
      await this.fetchCard();
      this.setting = this.$store.getters["menu/breadcrumbs"].slice(-1).pop();
      this.isShowButtonSave = true;
    } catch (e) {
      console.error(e);
      this.$store.commit("data_card/setSavedError", true);
      this.$store.commit(
        "data_card/setErrorMessage",
        e?.response?.data || { MESSAGE: "Ошибка отображения компонента" }
      );
    } finally {
      this.$store.commit("data_card/setLoading", false);
      this.$store.commit("data_card/setDisabled", false);
    }
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
    ]),
    ...mapGetters("auth", ["getLogged", "getUser"]),
    isReadOnly() {
      return this.$store.getters["data_card/getReadOnly"];
    },
    isBlock() {
      return this.$store.getters["menu/getMenuById"](this.menuId)?.LUSEBLOCK;
    },
    eventLocalHandler() {
      return () =>
        import(`/../components/EventHandler/${this.menuId}/eventHandler`);
    },
  },
  methods: {
    async loadScript() {
      return this.eventLocalHandler().then((script) => {
        return script.eventHandler;
      });
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
          console.log("error", data[i]);
          valid = false;
          this.$store.commit("data_card/setFormField", data[i]);
          this.$store.commit("data_card/saveButtonClicked", false);
        }
      }
      return valid;
    },
    async saveCard(e = {}) {
      await this.callScript(e, "beforeSave");

      const isReCapthcaNeededBeforeSave = await this.eventHandler(
        this.getForm.map((a) => ({ ...a })),
        e
      ).find((item) => item.name === "SCAPTCHA")?.visible;

      if (this.validateData(this.getForm)) {
        this.isShowSavedError = false;
        const { moduleId } = this;
        const itemId = this.menuId;
        const cardId = this.getFormParams.idCard;
        const relId = this.getFormParams.idRel;
        const { zone } = this;
        const resp = await this.$store.dispatch("data_card/saveDataCard", {
          moduleId,
          itemId,
          cardId,
          relId,
          zone,
          form: this.getForm,
        });
        if (resp.status === 200) {
          await this.$store.dispatch("data_card/fetchForm", {
            ...this.getFormParams,
            zone: this.zone,
          });

          const isReCapthcaNeededAfterSave = await this.eventHandler(
            this.getForm.map((a) => ({ ...a })),
            e
          ).find((item) => item.name === "SCAPTCHA")?.visible;

          if (isReCapthcaNeededBeforeSave !== isReCapthcaNeededAfterSave) {
            await this.callScript(e, "beforeSave");
            this.captchaIsDemandedNow = e;
            this.isCaptchaNeeded = true;
            return;
          }

          await this.callScript(e, "afterSave");
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
      if (this.cardId !== 0) {
        const { items } = await this.$store.dispatch(
          "data_card/fetchList",
          this.params
        );
        this.params.idCard = this.cardId || items[0].ID;
        if (this.rel !== null && this.rel !== "0") {
          this.params.idRel = this.rel;
        } else {
          this.params.idRel = items[0].REL;
        }
      } else {
        this.params.idCard = 0;
        this.params.idRel = undefined;
      }
      await this.$store.dispatch("data_card/fetchForm", this.params);
    },
    async updateValue(e) {
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
      const field = this.getForm.find((f) => f.fieldId === e.fieldId);
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM === this.menuId
      );
      await this.callScript(e, this.callbackAction);
      if (field.type === "button" && e.action) {
        const actionId = parseInt(e.value.replace("Item", ""));
        const actionRefreshCard = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 39 && item.ID === actionId;
        });
        const actionSaveCard = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 38 && item.ID === actionId;
        });
        const actionExecute = menu.ACTIONSCUR.find((item) => {
          return item.NTYPE === 4 && item.ID === actionId;
        });
        if (actionSaveCard?.ID === actionId) {
          const node = document.querySelector('[title="reCAPTCHA"]');
          if (node && !this.$store.getters["data_card/getRecaptchaToken"]) {
            this.$store.commit("data_card/saveButtonClicked", true);
            this.$store.commit("data_card/setUpdateEvent", e);
            this.$store.commit(
              "data_card/setUpdateValueFunction",
              this.updateValue
            );
            return;
          }
          await this.saveCard(e);
          this.$store.commit("data_card/setRecaptchaToken", null);
          this.$store.commit("data_card/saveButtonClicked", false);
        }
        if (actionRefreshCard?.ID === actionId) {
          await this.fetchCard();
        }
        if (actionExecute?.ID === actionId) {
          const response = await this.$store.dispatch(
            "data_card/executeAction",
            {
              actionId: actionExecute?.ID,
              relActionId: actionExecute?.REL,
              relId: this.rel,
              rowId: this.cardId,
              body: this.$store.getters["data_card/getActionParams"],
            }
          );
          if (response?.data) {
            if (response.data.POUTVALUE) {
              if (response.data.POUTVALUE.includes("/")) {
                window.open(response.data.POUTVALUE);
              }
            }
          }
        }
      }
    },
    updateBlurValue($event) {
      this.callScript($event, $event);
    },
  },

  watch: {
    isCaptchaNeededCheck() {
      this.$store.commit("data_card/saveButtonClicked", true);
      this.$store.commit("data_card/setUpdateEvent", this.captchaIsDemandedNow);
      this.$store.commit("data_card/setUpdateValueFunction", this.updateValue);
    },
  },
};
</script>

<style scoped></style>
