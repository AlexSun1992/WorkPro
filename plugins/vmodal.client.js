import Vue from "vue";
import VModal from "@/components/Libs/VModal/VModal";

Vue.component("VModal", VModal);

export default (ctx, inject) => {
  const bus = new Vue();

  function normalizeStringOrVNode(h, content) {
    if (typeof content === "function") {
      return content(h);
    }
    if (typeof content === "string") {
      return h("div", { domProps: { innerHTML: content } });
    }
    return content;
  }

  function confirm(content, options = {}) {
    return new Promise((resolve) => {
      const mountPoint = document.createElement("div");
      document.body.appendChild(mountPoint);

      const opts = {
        title: "Подтверждение",
        size: "md",
        okTitle: "Да",
        cancelTitle: "Нет",
        okVariant: "success",
        cancelVariant: "secondary",
        buttonSize: "md",
        footerClass: "p-2",
        hideHeaderClose: false,
        modalClass: [],
        centered: true,
        ...options,
      };

      const vm = new Vue({
        name: "VModalConfirmHost",
        components: { VModal },
        data: () => ({ visible: true }),
        methods: {
          _cleanup() {
            this.$destroy();
            if (mountPoint && mountPoint.parentNode) {
              mountPoint.parentNode.removeChild(mountPoint);
            }
          },
          _onOk() {
            resolve(true);
            this._cleanup();
          },
          _onCancel() {
            resolve(false);
            this._cleanup();
          },
          _onHidden() {
            this._cleanup();
          },
        },
        render(h) {
          return h(
            "VModal",
            {
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
                hideHeader: false,
                hideFooter: false,
                hideOk: false,
                hideCancel: false,
                hideClose: Boolean(opts.hideHeaderClose) === false ? false : Boolean(opts.hideHeaderClose),
                closeOnEsc: opts.persistent ? false : opts.closeOnEsc !== false,
                closeOnBackdrop: opts.persistent ? false : opts.closeOnBackdrop !== false,
                persistent: Boolean(opts.persistent),
              },
              on: {
                input: (v) => {
                  this.visible = v;
                },
                ok: this._onOk,
                cancel: this._onCancel,
                hidden: this._onHidden,
              },
            },
            [normalizeStringOrVNode(h, content)]
          );
        },
      });

      vm.$mount(mountPoint);
    });
  }

  inject("vmodal", {
    on: (...a) => bus.$on(...a),
    off: (...a) => bus.$off(...a),
    emit: (...a) => bus.$emit(...a),
    confirm,
  });
};
