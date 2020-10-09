<template>
  <div>
    <component
      :is="params.settings.isModal ? 'b-modal' : 'div'"
      :modal-class="myclass"
      @close="closeModal"
      id="modal"
      no-close-on-backdrop
      hide-footer
    >
      <div class="block-title pt-0 position-relative mt-2 mb-4">
        <i class="icon-my-profile"></i>{{ params.settings.text }}
      </div>
      <div class="profile row">
        <div class="col">
          <card-editor
            class="bg-six block-border-one block p-4"
            @error="$emit('error')"
            :data="dataForm"
            :edit="params.settings.edit"
            :params="params"
          ></card-editor>
        </div>
        <v-runtime-template
          v-if="params.settings.cardtemplate"
          :template="params.settings.cardtemplate"
        ></v-runtime-template>
      </div>
    </component>
  </div>
</template>

<script>
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import VRuntimeTemplate from "v-runtime-template";
export default {
  name: "FormPage",
  components: { CardEditor, VRuntimeTemplate },
  props: ["params"],

  data() {
    return {
      myclass: ["cabinet"],
    };
  },

  mounted() {
    this.$bvModal.show("modal");
  },

  async created() {
    this.$store.commit("data_card/clearFormData");
    // Будем ли держать в data_card?
    const list = await this.$axios.get(
      `/api/list/${this.params.page.idModule}/${this.params.page.idItem}/[]`
    );
    const params = {
      idModule: this.params.page.idModule,
      idItem: this.params.page.idItem,
      idCard: list.data.items[0].ID,
    };
    await this.$store.dispatch("data_card/fetchForm", params);
    // this.$router.push(`/cabinet/${params.idModule}/0/${params.idItem}/${params.idCard}`)
  },
  methods: {
    closeModal() {
      this.$router.back();
    },
  },
  computed: {
    dataForm() {
      return JSON.parse(
        JSON.stringify(this.$store.getters["data_card/getForm"])
      );
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
.modal-dialog {
  min-width: 80vw;
}
</style>
