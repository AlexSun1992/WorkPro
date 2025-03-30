<template>
  <div>
    <button type="button" @click="openModal">Кнопка</button>

    <control-modal ref="modal" :data="data" @close="closeModal" />
  </div>
</template>

<script>
import ControlModal from "./ControlModal.vue";

export default {
  name: "AsyncModalAction",
  components: { ControlModal },
  props: {
    data: {
      type: Object,
      default() {
        return {
          value: "Идёт обработка сурового запроса!",
          label: "Пожалуйста подождите",
        };
      },
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  methods: {
    closeModal() {
    },
    openModal() {
      this.$refs.modal.openModal();
    },
  },
};
</script>

<style scoped></style>
