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

export default {
  name: "SelectItemFromTemplate",

  components: {
    ChooseButton,
  },

  props: {
    dictionaryList: {
      type: Object,
      required: false,
      default: () => null,
    },
    itemId: {
      required: false,
      default: () => null,
    },
    cardId: {
      required: false,
      default: () => null,
    },
    isOpenCard: {
      type: Boolean,
      required: false,
      default: () => false,
    },
    propertyId: {
      type: String,
      required: false,
      default: () => null,
    },
  },
  data() {
    return {
      indicator: null,
    };
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
    actions: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.itemId).ACTIONSCUR;
      },
    },

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

    parentMenu: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.itemId).NPARENTMENU;
      },
    },
    isEmptyContent: {
      get: function () {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return !block?.data?.items.length;
        } else {
          return false;
        }
      },
    },
  },

  methods: {
    update(event) {
      this.$emit("update", event);
    },
    openCard(item) {
      try {
        if (this.isOpenCard) {
          this.$router.push(
            `/cabinet/55/0/${this.parentMenu ? this.parentMenu : this.itemId}/${
              item.ID || item[this.propertyId]
            }${item.RELCARD ? `/${item.RELCARD}` : `/${item.REL}`}`
          );
        }
      } catch (err) {
        this.$bvToast.toast(err.response.data.MESSAGE, {
          title: "Ошибка",
          variant: "danger",
          noAutoHide: true,
          solid: true,
        });
      }
    },
  },
};
</script>
