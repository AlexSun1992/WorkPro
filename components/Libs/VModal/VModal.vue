<template>
  <dialog
    ref="dlg"
    :class="rootClasses"
    :aria-label="ariaLabel || title || 'Modal dialog'"
    @close="handleNativeClose"
    @cancel="handleNativeCancel"
    @click="onBackdropClick"
  >
    <div
      class="vmodal__panel"
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
        </slot>
      </div>

      <section class="vmodal__body">
        <div
          v-if="title"
          :id="idTitle"
          class="vmodal__title"
        >
          {{ title }}
        </div>
        <slot />
      </section>

      <div
        v-if="!hideFooter"
        class="vmodal__footer mt-4"
        :class="footerClass"
      >
        <slot name="footer">
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
        </slot>
      </div>
    </div>
  </dialog>
</template>

<script>
// Vue 2.7 поддерживает Composition API «из коробки».
// В Nuxt 2 можно также через '@nuxtjs/composition-api' — синтаксис тот же.
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import dialogPolyfill from "dialog-polyfill";
// eslint-disable-next-line import/extensions
import "dialog-polyfill/dist/dialog-polyfill.css";
import { createFocusTrap } from "focus-trap";

export default {
  name: "VModal",
  props: {
    // двусторонняя связь (Vue2 и Vue3-стиль одновременно)
    modelValue: { type: Boolean, default: undefined }, // v-model (Vue3)
    value: { type: Boolean, default: undefined }, // v-model (Vue2)

    // UI
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
    okVariant: { type: String, default: "primary" }, // 'success' | 'danger' | ...
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
    const isOpen = ref(!!(props.modelValue ?? props.value));
    const trap = ref(null);
    const idTitle = `vmodal-title-${Math.random().toString(36).slice(2)}`;

    // классы
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
        if (v === undefined) return;
        setModel(!!v);
      }
    );
    watch(
      () => props.value,
      (v) => {
        // Vue 2 v-model
        if (props.modelValue !== undefined) return;
        setModel(!!v);
      }
    );

    onMounted(() => {
      // полифилл для браузеров без showModal/close
      if (dlg.value && !dlg.value.showModal) dialogPolyfill.registerDialog(dlg.value);
      // блокируем нативный submit как закрывашку
      // dlg.value && dlg.value.addEventListener("submit", (e) => e.preventDefault());
      if (isOpen.value) open(); // открыть, если смоделировано как открытое
      document.addEventListener("keydown", onKeydown, true);
    });
    onBeforeUnmount(() => {
      if (dlg.value?.hasAttribute("open")) {
        try {
          dlg.value.close();
        } catch (e) {
          console.error(e);
        }
      }
      teardownTrap();
      unlockScroll();
      document.removeEventListener("keydown", onKeydown, true);
    });

    // изменить модель (и вызвать open/close)
    function setModel(v) {
      console.log("setModel", v);
      if (v) open();
      else close();
      // синхронизируем обе версии v-model
      emit("input", !!v); // Vue 2
      emit("update:modelValue", !!v); // Vue 3
    }

    // хоткеи
    function onKeydown(e) {
      if (!isOpen.value) return;
      // Esc → cancel
      if (e.key === "Escape" && props.escToCancel) {
        if (!props.persistent && props.closeOnEsc !== false) {
          e.preventDefault();
          emitCancel();
        }
      }
      // Ctrl/Cmd+Enter → ok
      if (e.key === "Enter" && (e.ctrlKey || e.metaKey) && props.ctrlEnterToOk) {
        e.preventDefault();
        emitOk();
      }
      // Enter → ok (кроме textarea/кнопок)
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

    // открыть по нативному API
    function open() {
      if (!dlg.value || !dlg.value) return;
      // проверяем реальное открытие по атрибуту [open]
      const alreadyOpen = dlg.value.hasAttribute("open");
      if (alreadyOpen) return;

      try {
        if (typeof dlg.value.showModal === "function") {
          dlg.value.showModal(); // HTMLDialogElement API
        } else {
          dlg.value.setAttribute("open", ""); // фолбек
          dlg.value.style.display = "";
        }
        isOpen.value = true;
        lockScroll();
        setupTrap();
        if (!dlg.value.classList.contains("cabinet")) dlg.value.classList.add("cabinet");
        setTimeout(() => emit("shown"), 0);
      } catch (e) {
        /* noop */
      }
    }

    // закрыть по нативному API
    function close() {
      if (!dlg.value || !dlg.value) return;
      try {
        if (typeof dlg.value.close === "function") {
          dlg.value.close(); // HTMLDialogElement
        } else {
          // фолбек
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
      if (!e.prevented) setModel(false);
    }
    function emitCancel() {
      dlg.value.close();
      const e = {
        prevented: false,
        preventDefault() {
          this.prevented = true;
        },
      };
      emit("cancel", e);
      if (!e.prevented) setModel(false);
    }

    // нативные события диалога
    function handleNativeClose() {
      // диалог закрылся (Esc/submit/close()), синхронизируем модель
      if (isOpen.value) setModel(false);
    }
    function handleNativeCancel(ev) {
      // Esc: уважаем флаги
      if (!props.closeOnEsc || props.persistent) {
        ev.preventDefault();
        return;
      }
      emitCancel();
    }

    function onBackdropClick(e) {
      if (!props.closeOnBackdrop || props.persistent) return;
      // клик пришёл именно по фону (по самому <dialog>, а не по содержимому)
      if (e.target === dlg.value) {
        // закрыть нативно и синхронизироваться через @close
        try {
          dlg.value.close();
        } catch (e) {
          console.error(e);
        }
        // emitCancel можно НЕ вызывать (иначе будет двойное закрытие через @close),
        // но если нужно событие cancel — оставь и не вызывай setModel(false) внутри него.
        dlg.value.close();
        emitCancel();
      }
    }

    // focus trap
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
        if (trap.value) trap.value.deactivate();
        trap.value = null;
      } catch {
        /* noop */
      }
    }

    // lock/unlock scroll
    function lockScroll() {
      document.documentElement.classList.add("vmodal-lock");
      document.body.classList.add("vmodal-lock");
    }
    function unlockScroll() {
      document.documentElement.classList.remove("vmodal-lock");
      document.body.classList.remove("vmodal-lock");
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
dialog {
  flex-direction: column;
  position: "fixed" !important;
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
  }
  .vmodal__footer button + button {
    margin-left: 0px;
    margin-top: 1rem;
  }
  dialog {
    padding: 30px;
  }
  .vmodal__header {
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
  .vmodal__x {
    top: 12px;
    right: 12px;
  }
}
</style>

<style>
html.vmodal-lock,
body.vmodal-lock {
  overflow: hidden !important;
}
</style>
