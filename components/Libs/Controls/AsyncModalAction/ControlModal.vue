<template>
  <div>
    <dialog
      ref="modal"
      @close="escPressed"
    >
      <div class="dialog-header">
        <slot name="title">
          <span>{{ data.label }}</span>
        </slot>
        <button
          class="close"
          type="button"
          @click="closeModal"
          v-if="showClose"
        ></button>
      </div>

      <div class="dialog-main">
        <slot name="default">
          {{ data.value }}
        </slot>
      </div>

      <div class="dialog-footer">
        <slot name="footer"> </slot>
        <button
          class="btn-primary"
          type="button"
          v-if="showOk"
          @click="ok"
        >
          Ок
        </button>
        <button
          class="btn-secondary"
          type="button"
          v-if="showCancel"
          @click="cancel"
        >
          Отмена
        </button>
      </div>
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
      default: true,
    },
    showCancel: {
      type: Boolean,
      default: true,
    },
    showOk: {
      type: Boolean,
      default: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    closeOnESC: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  computed: {},
  methods: {
    escPressed(ev) {
      if (ev.code !== "Escape") {
        return;
      }

      ev.preventDefault();

      if (this.closeOnESC) {
        this.closeModal();
      }
    },
    closeModal(stop = false) {
      this.isModalOpen = false;
      this.$refs.modal?.close();

      if (!stop) {
        this.$emit("close");
      }
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
  },
  mounted() {
    window.addEventListener("keydown", this.escPressed);
  },
  destroyed() {
    window.removeEventListener("keydown", this.escPressed);
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

<style scoped>
dialog {
  flex-direction: column;
  width: 100%;
  pointer-events: auto;
  outline: 0;
  background: var(--white, #fff);
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
.dialog-header {
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
.dialog-main {
  font-family: SF Pro Display;
  font-weight: 400;
  font-size: 1.125rem;
  line-height: 30px;
  color: var(--black, #292929);
}
.dialog-header:before,
.dialog-header:after {
  display: none;
}
.dialog-footer {
  margin-top: 1.5rem;
}
.dialog-main::-webkit-scrollbar-thumb {
  background: #009639;
  width: 2px;
  border: 2px solid #ffff;
  border-radius: 5px;
}

.dialog-main::-webkit-scrollbar {
  width: 2px;
}
.dialog-main::-webkit-scrollbar:vertical {
  border: 3px solid transparent;
  width: 6px;
}

.close {
  position: absolute;
  right: 44px;
  top: 32px;
  display: block;
  width: 32px;
  height: 32px;
  border: 0;
  font-size: 0;
  padding: 0;
  background: #edf8ea url(/system/modules/ru.reso.v2/resources/img/icons/icon-modal-close.svg) 50% 50% no-repeat;
  border-radius: 32px;
}

@media (max-width: 568px) {
  dialog {
    padding: 30px;
  }
  .dialog-header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 auto;
    line-height: 1;
  }

  dialog {
    width: 100%;
    bottom: 0;
    border-radius: 30px 30px 0 0;
    z-index: 1;
    top: auto;
  }
}
</style>
