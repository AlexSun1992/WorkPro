import Vue from "vue";
import { getOptions } from "./PluginModal.helper";

const generateContainerId = (length = 2) => {
  const hash = `${Date.now()}_${Math.random().toString(16).slice(length)}`;
  return `modalContainer_${hash}`;
};

const PluginModal = {
  install(Vue) {
    Vue.prototype.$modal = {
      alert(param1, param2) {
        if (typeof document === "undefined") {
          return Promise.resolve(false);
        }

        const args = getOptions(param1, param2);

        const mountEl = document.querySelector(".cabinet");
        if (!mountEl) {
          console.error("PluginModal: элемент .cabinet не найден");
          return Promise.resolve(false);
        }

        const containerId = generateContainerId();

        const container = document.createElement("div");
        container.id = containerId;
        mountEl.insertBefore(container, mountEl.firstChild);

        return new Promise((resolve) => {
          const ModalContent = Vue.extend({
            name: "PluginModal",
            data() {
              return {
                nameBtn: "Отлично",
                isModalVisible: true,
                args,
              };
            },
            computed: {
              icon() {
                return this.args?.img ? `/img/icon-${this.args.img}.svg` : "";
              },
            },
            mounted() {
              this.$nextTick(() => {
                if (this.$refs.btnClose) {
                  this.$refs.btnClose?.focus();
                }
              });
              document.addEventListener("keyup", this.escapeHandler);
            },
            beforeUnmount() {
              document.removeEventListener("keyup", this.escapeHandler);
            },
            methods: {
              close(choice) {
                if (!this.isModalVisible) {
                  return;
                }

                this.isModalVisible = false;
                resolve(Boolean(choice));

                this.$nextTick(() => {
                  this.$destroy();
                  if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                  }
                });
              },
              escapeHandler(evt) {
                if (evt.key === "Escape") {
                  this.close(false);
                }
              },
            },
            render(h) {
              if (!this.isModalVisible) {
                return h("div");
              }

              const children = [];

              children.push(
                h(
                  "button",
                  {
                    class: "btn-modal-close",
                    ref: "btnClose",
                    attrs: { type: "button", "aria-label": "Закрыть" },
                    on: { click: () => this.close(false) },
                  },
                  "close"
                )
              );

              if (this.args.img || this.args.msg || this.args.title) {
                const titleChildren = [];

                if (this.args.img) {
                  titleChildren.push(
                    h("img", {
                      attrs: { src: this.icon, alt: "" },
                    })
                  );
                }

                if (this.args.title) {
                  titleChildren.push(h("div", { class: "mt-3", attrs: { id: "modalTitle" } }, this.args.title));
                }

                children.push(
                  h("div", [
                    h("h5", { class: "modal-title" }, titleChildren),
                    this.args.msg ? h("div", { class: "mt-3", attrs: { id: "modalDesc" } }, this.args.msg) : null,
                    this.args.info
                      ? h("div", { class: "mt-3 htmlStyleWarning", attrs: { id: "modalInfo" } }, this.args.info)
                      : null,
                  ])
                );
              }

              if (this.args.temp) {
                children.push(
                  h("div", {
                    attrs: { id: "isSlotTemplate" },
                    domProps: { innerHTML: this.args.temp },
                  })
                );
              }

              if (this.args?.btnOk !== false) {
                children.push(
                  h(
                    "button",
                    {
                      class: "btn-primary mt-3",
                      attrs: { type: "button" },
                      on: { click: () => this.close(true) },
                    },
                    this.nameBtn
                  )
                );
              }

              return h(
                "div",
                {
                  class: "dialogModalWrapper",
                  attrs: {
                    role: "dialog",
                    "aria-modal": "true",
                    "aria-labelledby": this.args?.title ? "modalTitle" : null,
                    "aria-describedby": this.args?.msg ? "modalDesc" : null,
                  },
                },
                [h("div", { attrs: { id: "dialogModal" } }, [h("div", children)])]
              );
            },
          });

          const content = new ModalContent();
          content.$mount(`#${containerId}`);
        });
      },
    };
  },
};

export default PluginModal;

Vue.use(PluginModal);
