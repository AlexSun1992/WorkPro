<template>
  <div>
    <slot name="rowData" v-bind:content="dataContent.items"></slot>
    <slot name="data" v-for="item in dataContent.items" v-bind:content="item">
    </slot>
    <slot :update="update" v-bind:content="dataContent.items"></slot>
    <b-spinner v-if="!dataContent.items"></b-spinner>
  </div>
</template>

<script>
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock/FilterBlock.vue";
import Loader from "./Loader.vue";

export default {
  name: "SelectItemFromTemplate",
  components: {
    FilterBlock,
    Loader,
  },

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
      required: false,
      default: () => "",
    },
    name: {
      type: String,
      required: false,
      default: () => "",
    },
    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
    isEmpty: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    data: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  async fetch() {
    try {
      (await this.cardId)
        ? this.$store.dispatch("blocks/fetchWizardBlock", {
            itemId: this.itemId,
            cardId: this.cardId,
          })
        : this.$store.dispatch("blocks/fetchBlock", {
            id: this.itemId,
            query: { ...this.$route.query },
          });
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

      Object.keys(value_prepare).map((key, index) => {
        if (Number.isInteger(value_prepare[key]) === false) {
          try {
            JSON.parse(value_prepare[key]);
            delete value_prepare[key];
          } catch (e) {
            value_prepare[key] = value_prepare[key];
          }
        } else {
          value_prepare[key] = value_prepare[key];
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
        el.clickOutsideEvent = function (event) {
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
