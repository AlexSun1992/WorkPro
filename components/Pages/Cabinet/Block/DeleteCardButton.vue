<template>
  <button
    @click="$bvModal.show('confirmDelete' + menuId + itemId)"
    type="button"
    class="btn btn-secondary"
  >
    <ControlModal
      :id="'confirmDelete' + menuId + itemId"
      :is-open="isConfirmModalOpen"
      :has-footer="true"
      :show-close="true"
      :show-ok="false"
      :show-cancel="false"
      :close-on-out-side-click="false"
      :close-on-esc="true"
      :props-class="myclass"
      @close="closeConfirmModal"
    >
      <template #title> Удаление записи </template>

      <p class="mb-0">Вы действительно хотите удалить эту запись?</p>

      <template #footer>
        <div class="d-flex justify-content-between">
          <button
            type="button"
            class="btn-secondary"
            @click="closeConfirmModal"
          >
            Отмена
          </button>
          <button
            type="button"
            class="btn-danger"
            @click="deleteCard"
          >
            Удалить
          </button>
        </div>
      </template>
    </ControlModal>
    <slot>Удалить</slot>
  </button>
</template>

<script>
import ControlModal from "@/components/Libs/Controls/AsyncModalAction/ControlModal";

export default {
  name: "DeleteCardButton",
  components: { ControlModal },
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
      isConfirmModalOpen,
    };
  },
  methods: {
    openConfirmModal() {
      this.isConfirmModalOpen = true;
    },

    closeConfirmModal() {
      this.isConfirmModalOpen = false;
    },

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
