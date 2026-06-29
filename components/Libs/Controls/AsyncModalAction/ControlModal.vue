<template>
  <div
    ref="modal"
    :class="['dialog', propsClass, isModalOpen ? '' : 'hide_modal']"
    @keydown.escape.prevent="escPressed"
    @mousedown.self.prevent="closeModalOnBackdrop"
    @click.stop
  >
    <div class="dialog-content cabinet">
      <div
        v-if="hasHeader"
        class="dialog-header"
      >
        <slot name="title">
          <span>{{ data.label }}</span>
        </slot>
        <button
          v-if="showClose"
          class="close"
          type="button"
          @click="closeModal(false)"
        ></button>
      </div>

      <div class="dialog-main">
        <slot name="default">
          {{ data.value }}
        </slot>
      </div>

      <div
        v-if="hasFooter"
        class="dialog-footer"
      >
        <slot name="footer"> </slot>
        <button
          v-if="showOk"
          class="btn-primary"
          type="button"
          @click="ok"
        >
          Ок
        </button>
        <button
          v-if="showCancel"
          class="btn-secondary"
          type="button"
          @click="cancel"
        >
          Отмена
        </button>
      </div>
    </div>
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
    closeOnEsc: {
      type: Boolean,
      default: true,
    },
    closeOnOutSideClick: {
      type: Boolean,
      default: false,
    },
    propsClass: {
      type: String,
      default: "",
    },
    hasHeader: {
      type: Boolean,
      default: true,
    },
    hasFooter: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isModalOpen: false,
    };
  },
  watch: {
    isOpen(val) {
      if (val) {
        this.openModal();
      } else {
        this.closeModal();
      }
    },
  },
  mounted() {
    window.addEventListener("popstate", this.replaceState);
    this.$refs.modal.addEventListener("close", this.cancel);
    this.$refs.modal.addEventListener("cancel", this.cancel);
    document.body.appendChild(this.$refs.modal);
  },
  unmounted() {
    window.removeEventListener("popstate", this.replaceState);
    if (window.history.state?.modalOpen) {
      window.history.replaceState({ modalOpen: false }, "");
    }
    this.$unlockBodyScroll();
    document.removeEventListener("close", this.cancel);
    document.removeEventListener("cancel", this.cancel);
    this.isModalOpen = false;
  },
  methods: {
    escPressed() {
      if (this.closeOnEsc) {
        this.closeModal();
      }
    },

    closeModalOnBackdrop() {
      if (this.closeOnOutSideClick) {
        this.closeModal();
      }
    },

    closeModal(stop = false) {
      this.isModalOpen = false;
      this.$unlockBodyScroll();
      if (window.history.state?.modalOpen) {
        this.$emit("close");
        window.history.replaceState({ modalOpen: false }, "");
      }
      if (!stop) {
        this.$emit("close");
      }
    },
    openModal() {
      window.history.pushState({ modalOpen: true }, "");
      this.isModalOpen = true;
      this.$emit("open");
      this.$lockBodyScroll();
    },
    cancel() {
      if (window.history.state?.modalOpen) {
        this.$emit("close");
        window.history.replaceState({ modalOpen: false }, "");
      }
      this.isModalOpen = false;
      this.$emit("cancel");
      this.$unlockBodyScroll();
    },

    ok() {
      this.isModalOpen = false;
      this.$emit("ok");
      this.$unlockBodyScroll();
    },
    replaceState(event) {
      if (event.state?.modalOpen || this.isOpen) {
        this.$emit("close");
        window.history.replaceState({ modalOpen: false }, "");
      }
    },
  },
};
</script>

<style scoped>
.dialog {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  background-color: #00000080;
  outline: 0;
  border-radius: 0;
  z-index: 100;
}
.dialog-content {
  pointer-events: auto;
  background: var(--white, #fff);
  border: 1px solid #dfe3e5;
  box-sizing: border-box;
  box-shadow: 0px 4px 26px rgb(0, 0, 0, 0.18);
  border-radius: 30px;
  z-index: 12;
  width: 100%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 568px;
  position: relative;
  padding: 107px 50px 62px 50px;
  height: auto;
  width: 100%;
  max-height: 90%;
  overflow: hidden;
}
.dialog.open_modal {
  display: block;
}
.dialog.hide_modal {
  display: none;
}

.control-select-object-from-map .dialog-content {
  max-width: 1000px;
  z-index: 20;
  border: 0;
  height: fit-content;
  max-height: 90vh;
  overflow: hidden;
  min-height: 700px;
}
.dialog.control-select-object-from-map .dialog-content {
  padding: 24px 0;
}
.dialog-title,
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
  -webkit-overflow-scrolling: touch;
  max-height: 70vh;
  overflow: auto;
}
.control-select-object-from-map .dialog-main {
  height: 100%;
  max-height: 90vh;
}

.dialog-header:before,
.dialog-header:after {
  display: none;
}
.dialog-footer {
  margin-top: 1.5rem;
}
.dialog-content::-webkit-scrollbar-thumb,
.dialog-main::-webkit-scrollbar-thumb {
  background: #009639;
  width: 2px;
  border: 2px solid #ffff;
  border-radius: 5px;
}
.dialog-content::-webkit-scrollbar,
.dialog-main::-webkit-scrollbar {
  width: 2px;
}
.dialog-content::-webkit-scrollbar:vertical,
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

#select-city::v-deep .dialog-content {
  border-radius: 30px;
  padding: 0px;
  max-width: 800px;
}
#select-city::v-deep .dialog-main {
  padding: 30px;
}
#select-city::v-deep .dialog-header {
  font-size: 2rem;
  font-family: Raleway;
  font-style: normal;
  font-weight: 600;
  font-variant: lining-nums;
  padding: 30px 30px 0 30px;
  line-height: 2;
}

@media (max-width: 992px) {
  .dialog-content {
    width: 100%;
    bottom: 0;
    border-radius: 30px 30px 0 0;
    top: auto;
    height: auto;
    max-height: 80vh;
    padding: 30px;
    position: fixed;
    transform: none;
    left: 0;
  }
  #select-city::v-deep .dialog-content {
    border-radius: 30px 30px 0 0;
    padding: 30px 0 0 0;
    max-height: 70vh;
  }

  .dialog-header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 auto;
    line-height: 1;
  }

  .dialog.control-select-object-from-map .dialog-content {
    padding: 0 0 24px 0;
    border: 0;
    margin: 0;
    box-shadow: none;
    border-radius: 30px 30px 0 0;
    width: 100vw;
    max-width: 100vw;
    z-index: 20;
    height: auto;
    max-height: 80vh;
    overflow: hidden;
    min-height: 0;
  }

  .close_clinic {
    background: transparent url(/img/icon-titlte-back.svg) left 0px center no-repeat;
    padding-left: 32px;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.875rem;
    top: 33px;
  }

  .dialog-header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 auto;
    line-height: 1;
  }

  .close_clinic {
    background: transparent url(/img/icon-titlte-back.svg) left 0px center no-repeat;
    padding-left: 32px;
    font-size: 1.125rem;
    font-weight: 700;
    line-height: 1.875rem;
    top: 18px;
  }

  .dialog-main {
    max-height: 70vh;
    font-size: 0.875rem;
  }
  .dialog.control-select-object-from-map .dialog-main {
    max-height: 80vh;
    overflow-y: hidden;
  }

  #select-city::v-deep .dialog-main {
    max-height: 60vh;
  }
  #select-city::v-deep .dialog-header {
    padding: 0 30px;
    text-align: left;
    margin: 0;
    font-size: 1.25rem;
  }
  .close {
    position: absolute;
    top: 10px;
    border-radius: 5px;
    width: 70px;
    height: 5px;
    background: #c3c3c3;
    left: 50%;
    margin-left: -35px;
  }
}
</style>
