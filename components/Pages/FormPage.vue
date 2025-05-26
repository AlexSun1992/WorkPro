<template>
  <div>
    <component
      :is="params.settings.isModal ? 'b-modal' : 'div'"
      id="modal"
      :modal-class="myclass"
      no-close-on-backdrop
      hide-footer
      @close="closeModal"
    >
      <div class="profile row">
        <div class="col">
          <card-editor
            v-if="dataForm.length"
            ref="cardEditor"
            :data="dataForm"
            :edit="isReadOnly === false"
            :params="params"
            @error="$emit('error')"
          />
        </div>

        <v-runtime-template
          v-if="params.settings.cardtemplate"
          :template="params.settings.cardtemplate"
        />
      </div>
    </component>
    <div>
      <b-alert
        :show="getSavedError"
        class="mt-3"
        variant="danger"
        v-html="errorMessage"
      >
      </b-alert>
    </div>
    <div
      v-if="isButtonSave && params.settings.edit"
      class="mt-3 row button-container"
    >
      <div class="col-auto">
        <button
          pill
          :disabled="loading"
          type="button"
          class="btn btn-success col-12 col-md-auto mr-4"
          :style="isButtonDisabled"
          @click="saveDataCard"
        >
          Сохранить
          <span
            v-if="loading"
            role="status"
            class="spinner-border text-danger ml-2"
            style="width: 1rem; height: 1rem"
          >
            <span class="sr-only">Spinning</span>
          </span>
        </button>
      </div>
      <div class="col-auto" v-if="isButtonCancel">
        <button
          pill
          type="button"
          class="btn btn-outline-success col-12 col-md-auto mt-2 mt-md-0"
          :style="isButtonDisabled"
          @click="cancelDataCard"
        >
          Отменить
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VRuntimeTemplate from "v-runtime-template";
import CardEditor from "~/components/Libs/CardEditor/CardEditor";

export default {
  name: "FormPage",
  components: { CardEditor, VRuntimeTemplate },
  props: ["params"],
  data() {
    return {
      myclass: ["cabinet"],
      isErrorExist: false,
      pageParams: null,
    };
  },
  computed: {
    loading() {
      return this.$store.getters["data_card/getLoading"];
    },
    isButtonDisabled() {
      if (this.$refs.CardEditor) {
        return this.$refs.cardEditor.isButtonDisabled;
      }
    },

    getSavedError() {
      return this.$store.getters["data_card/getSavedError"];
    },

    // Получение массива с полями
    dataForm() {
      return JSON.parse(
        JSON.stringify(this.$store.getters["data_card/getForm"])
      );
    },

    errorMessage() {
      return this.$store.getters["data_card/getErrorMessage"];
    },

    isError() {
      return this.$store.getters["data_card/getError"];
    },
    isButtonSave() {
      return this.$store.getters["data_card/getBtnSave"];
    },
    isButtonCancel() {
      return this.$store.getters["data_card/getBtnCancel"];
    },
    isReadOnly() {
      return (
        this.$store.getters["data_card/getReadOnly"] ||
        this.params?.settings.edit === false
      );
    },
  },
  async created() {
    try {
      this.$store.commit("data_card/clearFormData");
      this.$store.commit("data_card/reverseBtnIsSave");
      // Будем ли держать в data_card?
      const list = await this.$axios.get(
        `/api/list/${this.params.page.idModule}/${this.params.page.idItem}/[]`
      );
      const params = {
        idModule: this.params.page.idModule,
        idItem: this.params.page.idItem,
        idCard: list.data.items[0].ID,
        idRel: list.data.items[0].REL,
      };
      this.pageParams = params;
      await this.$store.dispatch("data_card/fetchForm", params);
      // this.$router.push(`/cabinet/${params.idModule}/0/${params.idItem}/${params.idCard}`)
    } catch (e) {
      console.log(e);
    }
  },

  methods: {
    closeModal() {
      this.$router.back();
    },
    async saveDataCard() {
      if (this.$refs.cardEditor) {
        await this.$refs.cardEditor.saveDataCard();
        const isErr = this.$store.getters["data_card/getSavedError"];
        this.isErrorExist = isErr;
        if (isErr === false) {
          await this.$store.dispatch("data_card/fetchForm", this.pageParams);
        }
      }
    },

    cancelDataCard() {
      if (this.$refs.cardEditor) {
        this.$refs.cardEditor.cancelDataCard();
      }
    },
  },
};
</script>

<style>
.modal-content {
  top: 85px;
}
/* #modal {
  display: flex !important;
  align-items: center;
  justify-content: center;
} */
</style>
