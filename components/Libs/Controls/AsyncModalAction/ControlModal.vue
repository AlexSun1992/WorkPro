<template>
  <div>
    <dialog ref="modal">
      <header>
        <slot name="title">
          <span>{{ data.label }}</span>
        </slot>
        <button type="button" @click="closeModal" v-if="showClose">
          &#10006;
        </button>
      </header>

      <main>
        <slot name="default">
          {{ data.value }}
        </slot>
      </main>

      <footer>
        <slot name="footer"> </slot>
        <button class="btn-primary" type="button" v-if="showOk" @click="ok">Ок</button>
        <button class="btn-secondary" type="button" v-if="showCancel" @click="cancel">Отмена</button>
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
      },
    },
    showCancel: {
      type: Boolean,
      default() {
        return true;
      },
    },
    showOk: {
      type: Boolean,
      default() {
        return true;
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
    },
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

<style lang="scss" scoped>
dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  outline: 0;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #dfe3e5;
  box-sizing: border-box;
  box-shadow: 0px 4px 26px rgb(0, 0, 0, 0.08);
  border-radius: 30px;
  padding: 107px 50px 62px 50px;
  max-width: 568px;
  z-index: 12;
}

dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
dialog header {
  padding-top: 0;
  padding-bottom: 1rem;
  font-family: Raleway;
  font-style: normal;
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.5rem;
  font-feature-settings: "pnum" on, "lnum" on;
  color: #292929;
}
dialog main {
  font-family: SF Pro Display;
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 30px;
  color: #868686;
}
dialog header:before,
dialog header:after {
  display: none;
}
@media (max-width: 568px) {
  dialog {
    padding: 30px;
  }
  dialog header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 auto;
    line-height: 1;
  }

  dialog {
    width: 100%;
    top: auto;
    bottom: 0;
    border-radius: 30px 30px 0 0;
    transform: none;
    left: 0;
    z-index: 1;
  }
}
</style>
