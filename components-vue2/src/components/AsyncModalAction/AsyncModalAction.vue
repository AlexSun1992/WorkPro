<template>
  <div>
    <button type="button" @click="openModal">Кнопка</button>

    <control-modal :is-open="isOpen" :data="data" @close="closeModal" />
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
          value: "",
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
      this.isOpen = false;
    },
    openModal() {
      this.isOpen = true;
    },
  },
};
</script>

<style scoped></style>
