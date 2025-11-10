// plugins/cardmodal.client.js
import Vue from "vue";
import CardModal from "@/components/Libs/CardModal/CardModal";

export default (_ctx, inject) => {
  const ctx = _ctx; // просто короткое имя
  function open(options = {}) {
    return new Promise((resolve) => {
      const mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);
      const opts = {
        idWizard: null,
        idModule: null,
        idCard: 0,
        title: "Карточка",
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
        ...options,
      };

      let resolved = false;

      const vm = new Vue({
        store: ctx.store,
        router: ctx.app && ctx.app.router,
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
          _onOk({ valid, values, formId }) {
            this.visible = false;
            this._resolve({ ok: true, valid: !!valid, values: values || {}, formId });
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
              centered: !!opts.centered,
              persistent: !!opts.persistent,
              moduleId: opts.idModule,
              itemId: opts.idItem,
              cardId: opts.idCard,
              relId: opts.idRel,
              params: opts.params,
              initialValues: opts.initialValues,
              readonly: !!opts.readonly,
              autoValidate: !!opts.autoValidate,
              preventCloseOnInvalid: !!opts.preventCloseOnInvalid,
            },
            on: {
              input: (v) => (this.visible = v),
              ok: this._onOk,
              cancel: this._onCancel,
              hidden: this._onHidden,
              error: this._onError,
            },
          });
        },
      });

      vm.$mount(mountPoint);
    });
  }

  inject("cardModal", { open });
};
