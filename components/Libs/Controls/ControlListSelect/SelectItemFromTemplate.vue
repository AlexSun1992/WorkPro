<template>
  <div>
    <slot
      name="data"
      v-for="item in dataContent.items"
      v-bind:content="item"
    ></slot>
    <slot :update="update" v-bind:content="dataContent.items"></slot>
  </div>
</template>

<script>
import ChooseButton from "../../../Pages/Cabinet/Block/ChooseButton.vue";
import FilterBlock from "../../../Pages/Cabinet/Block/FilterBlock.vue";
import ObjectsOnMap from "../../ObjectsOnMap/ObjectsOnMap.vue";

export default {
  name: "SelectItemFromTemplate",
  components: {
    ChooseButton,
    FilterBlock,
    ObjectsOnMap,
  },

  props: {
    itemId: {
      required: false,
      default: () => null,
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
  },
  data() {
    return {};
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
      this.$bvToast.toast(err.response.data.MESSAGE, {
        title: "Ошибка",
        variant: "danger",
        noAutoHide: true,
        solid: true,
      });
    }
  },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
    // isEmptyContent: {
    //   get: function () {
    //     const block = this.$store.getters["blocks/getBlockById"](this.itemId);
    //     if (block) {
    //       console.log(block);
    //       return !block?.data?.items.length;
    //     } else {
    //       return false;
    //     }
    //   },
    // },
  },

  methods: {
    update(event) {
      this.$emit("update", event);
    },
  },
};
</script>
