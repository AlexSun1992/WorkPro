import Vue from "vue";
import { getOptions } from "./PluginModal.helper";

let resolveData = () => null;
 const PluginModal = {
  install() {
    Vue.prototype.$modal = {
      async alert(param1, param2) {
        const restructOptions = getOptions(param1, param2);
        document.querySelector(".cabinet").insertAdjacentHTML(
          "afterbegin",
          `<div id='dialogModalWrapper'>
        </div>`
        );
        const ModalContent = Vue.extend({
          name: "PluginModal",
          template: `
          <div id="dialogModalWrapper" v-if="isModalVisible">
          <div id="dialogModal">
            <div>
              <button class="btn-modal-close" @click="confirmAction(false)" ref='btnClose'>
                close
              </button>
              <div id="isArgumentTypeString"  v-if="args.img || args.msg || args.title">
                <h5 class="modal-title">
                <img v-if="args.img" :src=icon>
                <div class="mt-3" id="modalTitle" v-if="args.title">{{args.title}}</div>
                </h5>
                <div class="mt-3" id="modalDesc" v-if="args.msg">{{args.msg}}</div>
              </div>
              <div
                id="isSlotTemplate"
                v-if="args.temp"
                v-html="args.temp"
              ></div>
              <button v-if="args?.btnOk !== false" class="btn-primary mt-3" @click="confirmAction(true)">
                {{nameBtn}}
              </button>
            </div>
          </div>
        </div>
        `,
          data() {
            return {
              nameBtn: "Отлично",
              isModalVisible: true,
              args: restructOptions,
            };
          },
          computed: {
            icon() {
              return `/img/icon-${this.args?.img}.svg`;
            },
          },
          methods: {
            async confirmAction(choice) {
              resolveData(choice);
              this.isModalVisible = false;
            },
            escapeHandler(evt) {
              if (evt.key === "Escape") {
                resolveData(false);
                this.isModalVisible = false;
              }
            },
          },

          mounted() {
            this.$refs.btnClose.focus();
            document.addEventListener("keyup", this.escapeHandler);
          },
          unmounted() {
            document.removeEventListener("keyup", this.escapeHandler);
          },
        });

        const content = new ModalContent({});
        content.$mount("#dialogModalWrapper");
        return new Promise((resolve) => {
          resolveData = (data) => {
            if (data === true) {
              resolve(true);
            }
            if (data === false) {
              resolve(false);
            }
          };
        });
      },
    };
  },
};
export default PluginModal

Vue.use(PluginModal);
