import Vue from "vue";
import ControlModalCardInfo from "@/components/Libs/ControlModalCardInfo/ControlModalCardInfo";

let instance = null;
let resolveClose = null;

export default (context, inject) => {
  const ModalConstructor = Vue.extend(ControlModalCardInfo);

  const modal = {
    show(infoBlock) {
      if (!instance) {
        modal.createInstance(infoBlock);
      }

      instance.visible = true;

      return new Promise((resolve) => {
        resolveClose = resolve;
      });
    },
    hide() {
      if (instance) {
        instance.visible = false;
      }
      resolveClose?.();
      resolveClose = null;
    },
    destroy() {
      if (instance) {
        instance.$destroy();
        instance.$el?.parentNode?.removeChild(instance.$el);
        instance = null;
      }
      resolveClose?.();
      resolveClose = null;
    },
    createInstance(infoBlock) {
      instance = new ModalConstructor({ propsData: { data: infoBlock } });
      const el = document.createElement("div");
      instance.$mount(el);
      document.body.appendChild(instance.$el);
    },
  };

  context.app.router.beforeEach((to, from, next) => {
    if (to.path !== from.path) {
      modal.destroy();
    }
    next();
  });

  inject("modalCardInfo", modal);
};
