<script>
import ControlModal from "@/components/AsyncModalAction/ControlModal.vue";

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
    openModal() {},
  },
};
</script>

<template>
  <div>
    <button type="button" @click="openModal">Кнопка</button>

    <ControlModal :isOpen="isOpen" :data="data" @close="closeModal" />
  </div>
</template>

<style scoped></style>
