import Vue from "vue";
import CardModal from "@/components/Libs/CardModal/CardModal";

const DEFAULT_OPTIONS = {
  idWizard: 0,
  idModule: 55,
  idCard: 0,
  title: "",
  size: "xl",
  okTitle: "Сохранить",
  cancelTitle: "Отмена",
  okVariant: "primary",
  cancelVariant: "secondary",
  buttonSize: "md",
  footerClass: [],
  modalClass: [],
  centered: true,
  persistent: false,
  params: {},
  initialValues: {},
  readonly: false,
  autoValidate: true,
  preventCloseOnInvalid: true,
};

/**
 * Создаёт программный опенер CardModal, монтирующий модалку в document.body.
 *
 * @param {object} deps
 * @param {import('vuex').Store} deps.store — Vuex store, передаётся в хост-инстанс
 * @param {import('vue-router').default} [deps.router] — роутер (только для Nuxt; в публичной зоне отсутствует)
 * @returns {{ open: (options?: object) => Promise<object> }}
 */
export function createCardModal({ store, router } = {}) {
  function open(options = {}) {
    return new Promise((resolve) => {
      const mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);
      const opts = { ...DEFAULT_OPTIONS, ...options };

      let resolved = false;

      const vm = new Vue({
        store,
        router,
        name: "CardModalProgrammaticHost",
        components: { CardModal },
        data: () => ({ visible: true }),
        methods: {
          _resolve(payload) {
            if (resolved) return;
            resolved = true;
            this.$destroy();
            if (mountPoint && mountPoint.parentNode) mountPoint.parentNode.removeChild(mountPoint);
            resolve(payload);
          },
          _onOk({ valid, values, formId, cardId, relId }) {
            this.visible = false;
            this._resolve({ ok: true, valid: Boolean(valid), values: values || {}, formId, cardId, relId });
          },
          _onCancel() {
            this.visible = false;
            this._resolve({ ok: false, canceled: true });
          },
          _onHidden() {
            this._resolve({ ok: false, canceled: true });
          },
          _onError() {
            /* optional: toast/log */
          },
          _onGoNext({ nextTab, formId } = {}) {
            this.visible = false;
            this._resolve({ ok: true, goNext: true, nextTab: nextTab || null, formId });
          },
        },
        render(h) {
          return h("CardModal", {
            props: {
              value: this.visible,
              title: opts.title,
              size: opts.size,
              okTitle: opts.okTitle,
              cancelTitle: opts.cancelTitle,
              okVariant: opts.okVariant,
              cancelVariant: opts.cancelVariant,
              buttonSize: opts.buttonSize,
              footerClass: opts.footerClass,
              modalClass: opts.modalClass,
              centered: Boolean(opts.centered),
              persistent: Boolean(opts.persistent),
              moduleId: opts.idModule,
              itemId: opts.idItem,
              cardId: opts.idCard,
              listId: opts.idList,
              relId: opts.idRel,
              wizardId: opts.idWizard,
              params: opts.params,
              initialValues: opts.initialValues,
              readonly: Boolean(opts.readonly),
              autoValidate: Boolean(opts.autoValidate),
              preventCloseOnInvalid: Boolean(opts.preventCloseOnInvalid),
              zone: opts.zone || "",
            },
            on: {
              input: (v) => {
                this.visible = v;
              },
              ok: this._onOk,
              cancel: this._onCancel,
              hidden: this._onHidden,
              error: this._onError,
              goNext: this._onGoNext,
            },
          });
        },
      });

      vm.$mount(mountPoint);
    });
  }

  return { open };
}
