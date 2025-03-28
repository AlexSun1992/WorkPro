<template>
  <div>
    <dialog ref="modal">
      <header>
        <span>{{ data.label }}</span>
        <button type="button" @click="closeModal">&#10006;</button>
      </header>

      <main>
        {{ data.value }}
      </main>

      <footer></footer>
    </dialog>

    <button @click="openModal">Open</button>
  </div>
</template>

<script>
export default {
  name: "ControlModal",
  props: {
    data: {
      type: Object,
      default() {
        return {
          value: "",
          title: "Пожалуйста подождите",
        };
      },
      isOpen: {
        type: Boolean,
        default() {
          return false;
        },
      },
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    closeModal() {
      this.$refs.modal.close();
    },
    openModal() {
      debugger
      this.$refs.modal.showModal();
    },
    toggleModal() {
      if (this.isOpen) {
        this.openModal();
      }
      if (!this.isOpen) {
        this.closeModal();
      }
    }
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.openModal();
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
