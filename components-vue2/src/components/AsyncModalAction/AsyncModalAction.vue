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
          // число попыток выполнить один запрос
          attempts: 6,
          // секунды на выполнение одного запроса
          interval: 5
        };
      },
    },
  },
  computed: {
    attemptsComputed() {
      return this.data?.attempts ?? 6
    },
    intervalComputed() {
      const interval = this.data?.interval ?? 5;

      return interval * 1000;
    }
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
    executeAction() {

    }
  },
};
</script>

<style scoped></style>
