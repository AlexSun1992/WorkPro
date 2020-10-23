<template>
  <b-button @click="$bvModal.show('confirmDelete' + menuId + itemId)">
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
  </b-button>
</template>

<script>
export default {
  name: "OpenCardButton",
  props: {
    itemId: {
      type: Number,
      required: false,
      default: () => null,
    },
    menuId: {
      required: true,
      default: () => "",
    },
    moduleId: {
      type: String,
      required: true,
      default: () => "",
    },
    relId: {
      type: String,
      required: false,
      default: () => null,
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
        await this.$store.dispatch("blocks/deleteForm", {
          moduleId: this.moduleId,
          menuId: this.menuId,
          itemId: this.itemId,
          relId: this.relId,
        });
      } catch (err) {
        this.$bvToast.toast(err.response.data.MESSAGE, {
          title: "Ошибка",
          variant: "danger",
          noAutoHide: true,
          solid: true,
        });
      }
    },
  },
};
</script>

<style scoped></style>
