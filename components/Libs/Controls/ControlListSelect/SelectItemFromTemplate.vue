<template>
  <div>
    <slot
      name="rowData"
      :content="dataContent.items"
    ></slot>
    <slot
      name="data"
      v-for="item in dataContent.items"
      :content="item"
    >
    </slot>
    <slot
      :update="update"
      :content="dataContent.items"
    ></slot>
    <span
      v-if="!dataContent.items"
      class="spinner-border"
      ><span class="sr-only"></span
    ></span>
  </div>
</template>

<script>
export default {
  name: "SelectItemFromTemplate",
  components: {},

  data() {
    return {
      visible: false,
      isLoad: false,
      checkData: null,
    };
  },
  props: {
    itemId: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      default: () => "",
    },
    isButtonRender: {
      type: Object,
      default: () => {},
    },
    isEmpty: {
      type: Boolean,
      default: () => false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },

  async fetch() {
    try {
      if (await this.cardId) {
        this.$store.dispatch("blocks/fetchWizardBlock", {
          itemId: this.itemId,
          cardId: this.cardId,
        });
      } else {
        this.$store.dispatch("blocks/fetchBlock", {
          id: this.itemId,
          query: { ...this.$route.query },
        });
      }
    } catch (err) {
      this.$modal.alert({
        title: "Извините произошла ошибка",
        msg: err.response.data.MESSAGE,
        icon: "error",
        btnOk: false,
      });
    }
  },

  computed: {
    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        }
        return {};
      },
    },
    isEmptyContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block?.data?.items.length;
        }
        return false;
      },
    },
  },

  methods: {
    update(event) {
      this.$emit("update", event);
    },
    async openList() {
      this.visible = !this.visible;
      if (this.visible) {
        try {
          this.isLoad = true;
          await this.$store.dispatch("blocks/fetchBlock", {
            id: this.isButtonRender.menudic,
            query: this.$store.getters["data_card/getFilters"],
          });
          this.isLoad = false;
        } catch (err) {
          console.log(err);
        }
      }
    },
    selectItem(value) {
      const value_prepare = { ...value.data.item };

      Object.keys(value_prepare).forEach((key) => {
        if (Number.isInteger(value_prepare[key]) === false) {
          try {
            JSON.parse(value_prepare[key]);
            delete value_prepare[key];
          } catch (e) {
            console.error(e);
          }
        }
      });
      this.visible = false;
      console.log("selectItemFromTemplate");
      this.$store.commit("data_card/setFilters", value_prepare);
    },
    outside() {
      if (this.visible) {
        this.visible = false;
      }
    },
  },

  directives: {
    clickOutside: {
      bind(el, binding, vnode) {
        el.clickOutsideEvent = (event) => {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind(el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    },
  },
};
</script>
