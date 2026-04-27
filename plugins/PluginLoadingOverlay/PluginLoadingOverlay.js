import Vue from "vue";

import ControlLoadingOverlay from "@/components/Libs/Controls/ControlLoadingOverlay/ControlLoadingOverlay";

const PluginLoadingOverlay = {
  install() {
    let instance;
    const self = {
      async show(id = 0) {
        const LoadingOverlayContent = Vue.extend({
          name: "PluginLoadingOverlay",
          components: { ControlLoadingOverlay },
          template: `
            <ControlLoadingOverlay :visible="true"
                                   :isFullPage="true"/>
          `,
          beforeUnmount() {
            document.querySelector("#wrapperId")?.remove();
          },
        });
        const wrapperId = `loading-overlay-wrapper-${id}`;

        document.querySelector(`#${wrapperId}`)?.remove();
        document.querySelector(".cabinet").insertAdjacentHTML("afterbegin", `<div id="${wrapperId}"></div>`);

        const component = new LoadingOverlayContent();
        instance = component;
        component.$mount(`#${wrapperId}`);
      },
      hide() {
        instance?.$destroy();
        instance?.$el.parentNode.removeChild(instance.$el);
      },
    };
    Vue.prototype.$loadingOverlay = self;
  },
};

export default PluginLoadingOverlay;

Vue.use(PluginLoadingOverlay);
