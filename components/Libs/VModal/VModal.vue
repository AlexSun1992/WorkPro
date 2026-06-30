<template>
  <div
    ref="dlg"
    :class="['dialog', rootClasses]"
    :aria-label="ariaLabel || title || 'Modal dialog'"
    @close="handleNativeClose"
    @cancel="handleNativeCancel"
    @click="onBackdropClick"
  >
    <div
      class="dialog-content cabinet vmodal__panel"
      :class="panelClass"
      role="document"
      :aria-labelledby="title ? idTitle : null"
    >
      <div
        v-if="!hideHeader"
        class="vmodal__header"
        :class="headerClass"
      >
        <slot name="header">
          <button
            v-if="!hideClose"
            type="button"
            class="vmodal__x"
            aria-label="Close"
            @click="emitCancel"
          >
            ×
          </button>
          <img
            v-if="iconUrl"
            :src="iconUrl"
            alt="icon"
            class="mx-auto mb-4 d-block"
          />
          <div
            v-if="title"
            :id="idTitle"
            class="vmodal__title"
          >
            {{ title }}
          </div>
        </slot>
      </div>

      <section class="vmodal__body">
        <slot />
      </section>

      <div
        v-if="!hideFooter"
        class="vmodal__footer mt-4"
        :class="footerClass"
      >
        <slot name="footer">
          <div class="d-lg-flex justify-content-between">
            <button
              v-if="!hideCancel"
              type="button"
              :class="cancelBtnClass"
              @click="emitCancel"
            >
              {{ cancelTitle }}
            </button>
            <button
              v-if="!hideOk"
              type="button"
              :class="okBtnClass"
              @click="emitOk"
            >
              {{ okTitle }}
            </button>
          </div>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import { createFocusTrap } from "focus-trap";

export default {
  name: "VModal",
  props: {
    modelValue: { type: Boolean, default: undefined },
    value: { type: Boolean, default: undefined },

    // UI
    iconURL: { type: String, default: "" },
    title: { type: String, default: "" },
    size: { type: String, default: "md" }, // xs|sm|md|lg|xl
    okTitle: { type: String, default: "OK" },
    cancelTitle: { type: String, default: "Отмена" },

    // видимость
    hideHeader: { type: Boolean, default: false },
    hideFooter: { type: Boolean, default: false },
    hideOk: { type: Boolean, default: true },
    hideCancel: { type: Boolean, default: true },
    hideClose: { type: Boolean, default: false },

    // поведение закрытия
    closeOnEsc: { type: Boolean, default: true },
    closeOnBackdrop: { type: Boolean, default: true },
    persistent: { type: Boolean, default: false }, // запрещает закрытие по Esc/бэкдропу

    // хоткеи
    enterToOk: { type: Boolean, default: true },
    ctrlEnterToOk: { type: Boolean, default: true },
    escToCancel: { type: Boolean, default: true },

    // стили
    okVariant: { type: String, default: "primary" },
    cancelVariant: { type: String, default: "secondary" },
    buttonSize: { type: String, default: "md" }, // xs|sm|md|lg
    modalClass: { type: [String, Array, Object], default: () => [] },
    panelClass: { type: [String, Array, Object], default: () => [] },
    headerClass: { type: [String, Array, Object], default: () => [] },
    footerClass: { type: [String, Array, Object], default: () => [] },
    centered: { type: Boolean, default: false },

    ariaLabel: { type: String, default: "" },
  },
  emits: ["input", "update:modelValue", "ok", "cancel", "hidden", "shown"],
  setup(props, { emit }) {
    const dlg = ref(null);
    const isOpen = ref(Boolean(props.modelValue ?? props.value));
    const trap = ref(null);
    const idTitle = `vmodal-title-${Math.random().toString(36).slice(2)}`;
    const sizeClass = computed(() => `vmodal--${props.size}`);
    const rootClasses = computed(() => [
      "vmodal",
      sizeClass.value,
      { "is-open": isOpen.value, "vmodal--centered": props.centered },
      props.modalClass,
    ]);
    const okBtnClass = computed(() => ["btn", `btn-${props.okVariant}`, props.buttonSize && `btn-${props.buttonSize}`]);
    const cancelBtnClass = computed(() => [
      "btn",
      `btn-${props.cancelVariant}`,
      props.buttonSize && `btn-${props.buttonSize}`,
    ]);

    watch(
      () => props.modelValue,
      (v) => {
        if (v === undefined) {
          return;
        }
        setModel(Boolean(v));
      }
    );
    watch(
      () => props.value,
      (v) => {
        // Vue 2 v-model
        if (props.modelValue !== undefined) {
          return;
        }
        setModel(Boolean(v));
      }
    );

    onMounted(() => {
      if (isOpen.value) {
        open();
      } // открыть, если смоделировано как открытое
      document.addEventListener("keydown", onKeydown, true);
    });
    onBeforeUnmount(() => {
      if (dlg.value?.hasAttribute("open")) {
        try {
          isOpen.value = false;
        } catch (e) {
          console.error(e);
        }
      }
      teardownTrap();
      unlockScroll();
      document.removeEventListener("keydown", onKeydown, true);
    });

    function setModel(v) {
      console.log("setModel", v);
      if (v) {
        open();
      } else {
        close();
      }

      emit("input", Boolean(v)); // Vue 2
      emit("update:modelValue", Boolean(v)); // Vue 3
    }

    // хоткеи
    function onKeydown(e) {
      if (!isOpen.value) {
        return;
      }

      if (e.key === "Escape") {
        e.preventDefault();
        if (props.escToCancel && !props.persistent && props.closeOnEsc !== false) {
          emitCancel();
        }
      }

      if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && props.ctrlEnterToOk) {
        e.preventDefault();
        emitOk();
      }

      if (e.key === "Enter" && !e.ctrlKey && !e.metaKey && props.enterToOk) {
        const tag = e.target && e.target.tagName ? e.target.tagName.toLowerCase() : "";
        const type = e.target && e.target.type ? String(e.target.type).toLowerCase() : "";
        const isTextarea = tag === "textarea";
        const isButton = tag === "button" || type === "submit" || type === "button";
        if (!isTextarea && !isButton) {
          e.preventDefault();
          emitOk();
        }
      }
    }

    function open() {
      if (!dlg.value || !dlg.value) {
        return;
      }

      const alreadyOpen = dlg.value.hasAttribute("open");

      if (alreadyOpen) {
        return;
      }

      try {
        if (typeof dlg.value.showModal === "function") {
          dlg.value.showModal();
        } else {
          dlg.value.setAttribute("open", "");
          dlg.value.style.display = "";
        }
        isOpen.value = true;
        lockScroll();
        setupTrap();
        if (!dlg.value.classList.contains("cabinet")) {
          dlg.value.classList.add("cabinet");
        }
        setTimeout(() => emit("shown"), 0);
      } catch (e) {
        /* noop */
      }
    }

    function close() {
      if (!dlg.value || !dlg.value) {
        return;
      }
      try {
        if (typeof dlg.value.close === "function") {
          isOpen.value = false;
        } else {
          dlg.value.removeAttribute("open");
          dlg.value.style.display = "none";
        }
      } catch (e) {
        /* noop */
      }
      isOpen.value = false;
      teardownTrap();
      unlockScroll();
      setTimeout(() => emit("hidden"), 0);
    }

    function emitOk() {
      const e = {
        prevented: true,
        preventDefault() {
          this.prevented = true;
        },
      };
      emit("ok", e);
      if (!e.prevented) {
        setModel(false);
      }
    }

    function emitCancel() {
      isOpen.value = false;
      const e = {
        prevented: false,
        preventDefault() {
          this.prevented = true;
        },
      };
      emit("cancel", e);
      if (!e.prevented) {
        setModel(false);
      }
    }

    function handleNativeClose() {
      if (isOpen.value) {
        setModel(false);
      }
    }

    function handleNativeCancel(ev) {
      ev.preventDefault();
      if (!props.persistent && props.closeOnEsc !== false) {
        emitCancel();
      }
    }

    function onBackdropClick(e) {
      if (!props.closeOnBackdrop || props.persistent) {
        return;
      }

      if (e.target === dlg.value) {
        try {
          isOpen.value = false;
        } catch (e) {
          console.error(e);
        }
        isOpen.value = false;
        emitCancel();
      }
    }

    function setupTrap() {
      try {
        trap.value = createFocusTrap(dlg.value, {
          escapeDeactivates: false,
          allowOutsideClick: true,
          initialFocus: dlg.value.querySelector(".vmodal__panel") || dlg.value,
          fallbackFocus: dlg.value,
        });
        trap.value.activate();
      } catch {
        /* noop */
      }
    }

    function teardownTrap() {
      try {
        if (trap.value) {
          trap.value.deactivate();
        }
        trap.value = null;
      } catch {
        /* noop */
      }
    }

    function lockScroll() {
      const pebody = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.overflow = "hidden";
      document.documentElement.style.height = "100vh";
      document.body.style.paddingRight = `${pebody}px`;
    }

    function unlockScroll() {
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.paddingRight = "";
    }

    return {
      dlg,
      isOpen,
      close,
      open,
      idTitle,
      rootClasses,
      okBtnClass,
      cancelBtnClass,
      emitOk,
      emitCancel,
      handleNativeClose,
      handleNativeCancel,
      onBackdropClick,
    };
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

.vmodal__title {
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

.vmodal__header:before,
.vmodal__header:after {
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

.vmodal__x {
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

.vmodal__body::v-deep .conf-block {
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
}

.vmodal__footer button + button {
  margin-left: 20px;
}

@media (max-width: 568px) {
  .vmodal__footer button {
    display: block;
    width: 100%;
  }

  .vmodal__footer button + button {
    margin-left: 0px;
    margin-top: 1rem;
  }

  .dialog-content {
    padding: 30px;
  }

  .vmodal__header {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 auto;
    line-height: 1;
  }

  .dialog-content {
    width: 100%;
    bottom: 0;
    border-radius: 30px 30px 0 0;
    z-index: 1;
    top: auto;
    transform: none;
    left: 0;
    position: fixed;
    max-height: 80vh;
  }

  .vmodal__x {
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

.vmodal::v-deep .control-dropdown-menu.visible {
  max-height: 9rem;
}
</style>
