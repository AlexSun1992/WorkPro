<template>
  <div>
    <dialog ref="modal">
      <header>
        <slot name="title">
          <span>{{ data.label }}</span>
        </slot>
        <button type="button" @click="closeModal">&#10006;</button>
      </header>

      <main>
        <slot name="default">
          {{ data.value }}
        </slot>
      </main>

      <footer>
        <slot name="title"></slot>
      </footer>
    </dialog>
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
    },
    isOpen: {
      type: Boolean,
      default() {
        return false;
      },
    },
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {},
  methods: {
    closeModal() {
      this.isModalOpen = false;
      this.$refs.modal.close();
      this.$emit("close");
    },
    openModal() {
      this.isModalOpen = true;
      this.$refs.modal.showModal();
      this.$emit("open");
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
