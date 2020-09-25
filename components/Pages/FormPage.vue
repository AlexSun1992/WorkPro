<template>
  <component
    :is="params.settings.isModal ? 'b-modal' : 'div'"
    id="modal"
    no-close-on-backdrop
    hide-footer
  >
    <div class="block-title pt-0 position-relative mt-2 mb-4">
      <i class="icon-my-profile"></i>{{ params.settings.text }}
    </div>
    <div class="profile row">
      <card-editor
        class="bg-six block-border-one block col p-4"
        @error="$emit('error')"
        :data="dataForm"
        :edit="params.settings.edit"
        :params="params"
      ></card-editor>
      <v-runtime-template
        v-if="params.settings.cardtemplate"
        :template="params.settings.cardtemplate"
      ></v-runtime-template>
    </div>
  </component>
</template>

<script>
import CardEditor from "~/components/Libs/CardEditor/CardEditor";
import VRuntimeTemplate from "v-runtime-template";
export default {
  name: "FormPage",
  components: { CardEditor, VRuntimeTemplate },
  props: ["params"],

  mounted() {
    this.$bvModal.show("modal");
  },

  async created() {
    this.$store.commit("data_card/clearFormData");
    // Будем ли держать в data_card?
    let list = await this.$axios.get(
      `/api/list/${this.params.page.idModule}/${this.params.page.idItem}/[]`
    );
    let params = {
      idModule: this.params.page.idModule,
      idItem: this.params.page.idItem,
      idCard: list.data.items[0].ID,
    };
    await this.$store.dispatch("data_card/fetchForm", params);
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

