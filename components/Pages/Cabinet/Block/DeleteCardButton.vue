<template>
  <button
    @click="$bvModal.show('confirmDelete' + menuId + itemId)"
    type="button"
    class="btn btn-secondary"
  >
    <b-modal
      :modal-class="myclass"
      :id="'confirmDelete' + menuId + itemId"
      centered
      title="Удаление записи"
      ok-title="Удалить"
      cancel-title="Отмена"
      no-close-on-backdrop
      @ok="deleteCard"
    >
      Вы действительно хотите удалить эту запись?
    </b-modal>
    <slot>Удалить</slot>
  </button>
</template>

<script>
export default {
  name: "OpenCardButton",
  props: {
    itemId: {
      type: Number,
      default: null,
    },
    menuId: {
      type: String,
      required: true,
    },
    moduleId: {
      type: String,
      required: true,
    },
    relId: {
      type: String,
      default: null,
    },
    cardId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      myclass: ["cabinet"],
    };
  },
  methods: {
    async deleteCard() {
      try {
        const body = {
          moduleId: this.moduleId,
          menuId: this.menuId,
          itemId: this.itemId,
          cardId: this.cardId,
          relId: this.relId,
        };
        const actionName = this.cardId ? "deleteWizardForm" : "deleteForm";
        await this.$store.dispatch(`blocks/${actionName}`, body);
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>

<style scoped></style>
