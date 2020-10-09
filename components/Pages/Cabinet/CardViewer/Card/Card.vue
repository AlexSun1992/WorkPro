<template>
  <div>
    <b-card v-if="getFormData">
      <card-form
        :data="getFormData"
        :edit="editForm"
        @update="$emit('update', $event)"
      ></card-form>
    </b-card>
  </div>
</template>

<script>
import CardForm from "~/components/Pages/Cabinet/CardViewer/Card/CardForm";

export default {
  name: "Card",
  components: { CardForm },
  props: ["data"],
  data() {
    return {
      editForm: true,
    };
  },
  async created() {
    this.$store.dispatch("card/clearCardForm");
    const cardId = this.data.name.split("Card")[1];
    await this.$store.dispatch("card/fetchCardForm", cardId);
    if (this.$store.getters["menu/flatmenu"].length) {
      const menu = this.$store.getters["menu/flatmenu"].find(
        (item) => item.IDITEM == cardId
      );
      this.$emit("actions", menu.ACTIONSCUR);
    }
  },
  computed: {
    getFormData() {
      return JSON.parse(JSON.stringify(this.$store.getters["card/cardForm"]));
    },
  },
};
</script>

<style scoped></style>
