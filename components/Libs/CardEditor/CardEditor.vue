<template>
  <div>
    <Form
      v-if="data.length && !this.captions"
      :data="data"
      :tabs="tabs"
      @update="updateValue($event)"
      @clear="clearRelation($event)"
      @open-card="openCard($event)"
      :edit="edit"
    ></Form>
    <FormAccordion
      v-else-if="data.length"
      :class="{ 'mt-5': !params.settings && showBtnBack }"
      :data="data"
      :tabs="tabs"
      @update="updateValue($event)"
      @clear="clearRelation($event)"
      @open-card="openCard($event)"
      :edit="edit"
    />
    <SkeletonBox v-else-if="!isError" class="mt-5" :items="8"></SkeletonBox>
    <div class="error-message" v-else-if="isError">
      {{ errorMessage.INFO ? errorMessage.INFO : errorMessage.MESSAGE }}
    </div>
  </div>
</template>

<script>
import Form from "~/components/Libs/Form/Form";
import ActionButton from "~/components/Pages/Cabinet/Block/ActionButton";
import SkeletonBox from "~/components/Libs/SkeletonBox";
import FormAccordion from "@/components/Libs/Form/FormAccordion";
export default {
  name: "CardEditor",
  head() {
    return {
      script: [
        {
          // type: "module",
          src: `/api/card/js/${this.$route.params.idModule}/${this.$route.params.idItem}`,
        },
      ],
    };
  },
  components: { FormAccordion, Form, ActionButton, SkeletonBox },
  data() {
    return {
      invalidFields: [],
      body: null,
      disabledButtons: {
        background: "#dddbdd",
        boxShadow: "none",
        border: "none",
        color: "#dddbdd",
      },
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
  },
  mounted() {
    if (typeof initHandler === "function") {
      try {
        this.$store.commit(
          "data_card/setForm",
          initHandler(this.data.map((a) => Object.assign({}, a))) || this.data
        );
      } catch {}
    }
  },
  destroyed() {
    this.$store.commit("data_card/cardChanged", false);
    this.$store.commit("data_card/setError", false);
  },
  methods: {
    async updateValue(e) {
      this.$store.commit("data_card/cardChanged", true);
      if (typeof eventHandler === "function") {
        if (
          eventHandler(
            this.data.map((a) => Object.assign({}, a)),
            e
          )
        ) {
          this.$store.commit(
            "data_card/setForm",
            eventHandler(
              this.data.map((a) => Object.assign({}, a)),
              e
            ) || this.data
          );
        }
      }
      if (e.SCONST) {
        const form = this.$store.getters["data_card/getForm"];
        let response = await this.$store.dispatch("data_card/executeAction", {
          actionId: e.ID,
          relActionId: e.REL,
          relId: this.$route.params.idRel,
          rowId: this.$route.params.idCard,
          itemId: e.NITEM,
          body: form,
        });

        if (response?.response) {
          if (this.$route.path.includes("55/0/19")) {
            this.$emit("error", response.response.data.MESSAGE);
          } else {
            this.$bvToast.toast(response.response.data.MESSAGE, {
              title: "Ошибка",
              variant: "danger",
              noAutoHide: true,
              solid: true,
            });
          }
        } else {
          await this.$store.dispatch("data_card/fetchForm", this.$route.params);
        }
        return;
      }
      this.$store.commit("data_card/setFormField", {
        fieldId: e.fieldId,
        value: e.value,
      });
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
          (value == null || value == undefined || value == "") &&
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
      this.$store.commit("data_card/filterFields");
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
          await this.$store.dispatch("data_card/saveDataCard", {
            moduleId,
            itemId,
            cardId,
            relId,
            form: fields,
          });
          if (this.$route.params.idItem == "710") {
            await this.$store.dispatch("updateUser");
          }
          if (this.$route.params.idCard === "0") {
            cardId = this.$store.getters["data_card/getCardId"];
            relId = this.$store.getters["data_card/getCardRelId"];
            $nuxt._router.push(
              `/cabinet/${moduleId}/0/${itemId}/${cardId}${
                relId ? `/${relId}` : ""
              }`
            );
          }
          this.$bvToast.toast("Успешно сохранено", {
            title: "",
            variant: "success",
            solid: true,
          });
          this.$emit("error", null);
        } catch (err) {
          if (this.$route.path.includes("55/0/19")) {
            this.$emit(
              "error",
              err.response.data.INFO || err.response.data.MESSAGE
            );
          }
          let errorInfo = err.response.data.INFO
            ? err.response.data.INFO
            : err.response.data.MESSAGE;
          if (errorInfo) {
            this.$store.commit("data_card/setFieldError", errorInfo);
          }
          if (!this.$route.path.includes("55/0/19")) {
            this.$bvToast.toast(err.response.data.MESSAGE, {
              title: "Ошибка",
              variant: "danger",
              noAutoHide: true,
              solid: true,
            });
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
