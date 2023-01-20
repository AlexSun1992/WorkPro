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
    <div v-if="isButtonSave" class="mt-3 row button-container">
      <div v-if="params.settings.edit" class="col-12">
        <b-button
          pill
          type="button"
          variant="success"
          class="col-12 col-md-auto mr-4"
          :style="isButtonDisabled"
          @click="saveDataCard"
        >
          Сохранить
        </b-button>
        <b-button
          pill
          type="button"
          variant="outline-success"
          class="col-12 col-md-auto mt-2 mt-md-0"
          :style="isButtonDisabled"
          @click="cancelDataCard"
        >
          Отменить
        </b-button>
      </div>
    </div>

    <div class="row">
      <b-alert v-if="isErrorExist" class="mt-3" show variant="danger">
        {{ errorMessage }}
      </b-alert>
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
    };
  },
  computed: {
    isButtonDisabled() {
      if (this.$refs.CardEditor) {
        return this.$refs.cardEditor.isButtonDisabled;
      }
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
    saveDataCard() {
      console.log("saveDataCard начало выполнения кода");
      if (this.$refs.cardEditor) {
        this.$refs.cardEditor.saveDataCard();
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
