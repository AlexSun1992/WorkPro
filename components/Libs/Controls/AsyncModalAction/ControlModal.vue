<template>
  <div>
    <dialog ref="modal">
      <header>
        <slot name="title">
          <span>{{ data.label }}</span>
        </slot>
        <button type="button" @click="closeModal" v-if="showClose">&#10006;</button>
      </header>

      <main>
        <slot name="default">
          {{ data.value }}
        </slot>
      </main>

      <footer>
        <slot name="footer">

        </slot>
        <button type="button" v-if="showOk" @click="ok">Ок</button>
        <button type="button" v-if="showCancel" @click="cancel">Отмена</button>
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
    showClose: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showCancel: {
      type: Boolean,
      default() {
        return true;
      }
    },
    showOk: {
      type: Boolean,
      default() {
        return true;
      }
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
      this.$refs?.modal?.close();
      this.$emit("close");
    },
    openModal() {
      this.isModalOpen = true;
      this.$refs.modal.showModal();
      this.$emit("open");
    },
    cancel() {
      this.isModalOpen = false;
      this.$refs.modal.close();
      this.$emit("cancel");
    },
    ok() {
      this.isModalOpen = false;
      this.$refs.modal.close();
      this.$emit("ok");
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
}
</script>

<style lang="scss" scoped></style>
