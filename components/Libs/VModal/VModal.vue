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
      <header
        v-if="!hideHeader"
        class="vmodal__header"
        :class="headerClass"
      >
        <slot name="header">
          <h3
            v-if="title"
            :id="idTitle"
            class="vmodal__title"
          >
            {{ title }}
          </h3>
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
      </header>

      <section class="vmodal__body"><slot /></section>

      <footer
        v-if="!hideFooter"
        class="vmodal__footer"
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
      </footer>
    </div>
  </dialog>
</template>

<script>
// Vue 2.7 поддерживает Composition API «из коробки».
// В Nuxt 2 можно также через '@nuxtjs/composition-api' — синтаксис тот же.
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";
import dialogPolyfill from "dialog-polyfill";
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
    hideOk: { type: Boolean, default: false },
    hideCancel: { type: Boolean, default: false },
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
        } catch {}
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
        } catch {}
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
        trap.value && trap.value.deactivate();
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
/* базовый <dialog> */
.vmodal {
  border: none;
  padding: 0;
  color: inherit;
}

/* затемнение фона */
.vmodal::backdrop {
  background: rgba(0, 0, 0, 0.45);
}

/* центрирование: растягиваем диалог на вьюпорт и центруем контент */
.vmodal.vmodal--centered {
  position: fixed;
  inset: 0;
  margin: 0; /* убираем дефолтный margin у <dialog> */
  width: 100vw;
  height: 100vh; /* ключ к вертикальному центрированию */
  max-width: 100vw;
  background: transparent;
}

/* включаем флекс-центр только когда окно реально открыто */
.vmodal[open].vmodal--centered {
  display: flex;
  align-items: center; /* центр по вертикали */
  justify-content: center; /* центр по горизонтали */
}

/* панель модалки — размеры и скругления тут */
.vmodal__panel {
  background: #fff;
  border-radius: 16px; /* круглые углы */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: visible; /* чтобы попапы/календарь не обрезались */
  max-height: 85vh; /* не на всю высоту экрана */
  width: min(92vw, 840px); /* «бОльшая часть экрана», но не вся */
}

/* поддержка size — меняем ширину панели */
.vmodal--xs .vmodal__panel {
  width: min(92vw, 360px);
}
.vmodal--sm .vmodal__panel {
  width: min(92vw, 480px);
}
.vmodal--md .vmodal__panel {
  width: min(92vw, 640px);
}
.vmodal--lg .vmodal__panel {
  width: min(92vw, 840px);
}
.vmodal--xl .vmodal__panel {
  width: min(92vw, 1080px);
}

/* шапка: заголовок слева, крестик справа в одной строке */
.vmodal__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #eee;
}
.vmodal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  flex: 1 1 auto; /* тянется, чтобы крестик ушёл вправо */
}
.vmodal__x {
  margin-left: auto; /* уводим кнопку вправо */
  background: none;
  border: 0;
  font-size: 20px;
  line-height: 1;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}
.vmodal__x:hover {
  background: rgba(0, 0, 0, 0.05);
}
.vmodal__x:focus {
  outline: 2px solid rgba(47, 128, 237, 0.5);
  outline-offset: 2px;
}

/* тело и футер */
.vmodal__body {
  position: relative; /* якорь для абсолютных попапов */
  padding: 16px;
  overflow: auto; /* если попапы режутся — можно сделать visible и добавить внутренний .scroll */
}
.vmodal__footer {
  padding: 12px 16px;
  border-top: 1px solid #eee;
}

/* кнопки (как было) */

.vmodal__header {
  border-bottom: 0 !important; /* убираем линию */
  background: #fff; /* на всякий случай белый фон */
}

/* если где-то глобально ставят бордер у тела — глушим */
.vmodal__body {
  border-top: 0 !important;
}

/* чтобы не было визуальной щели из-за дефолтных отступов заголовка */
.vmodal__title {
  margin: 0 !important;
}
.vmodal__panel {
  background: #fff;
  border-radius: 20px; /* радиус углов окна */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  /* overflow оставляем visible, чтобы попапы не обрезались */
}

/* хедер принимает скругление сверху */
.vmodal__header {
  border-bottom: 0; /* уберём серую линию, если мешает */
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background: #fff;
}

/* футер принимает скругление снизу */
.vmodal__footer {
  border-top: 0;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background: #fff;
}

.vmodal__body {
  background: #fff;
}
.vmodal.cabinet >>> .vmodal__header::after {
  content: none !important;
  display: none !important;
}
</style>

<!-- Глобальные правила (не scoped), чтобы заблокировать скролл документа, когда модалка открыта -->
<style>
html.vmodal-lock,
body.vmodal-lock {
  overflow: hidden !important;
}
</style>
