<template>
  <div v-if="isOpenCard">
    <div
      v-for="(item, id, index) in dataContent.items"
      :key="id"
      @click.stop="openCard(item)"
    >
      <slot
        name="data"
        :update="update"
        :content="item"
        :index="index"
      />
    </div>
  </div>
  <div v-else>
    <slot
      v-for="(item,index) in dataContent.items"
      name="data"
      :content="item"
      :index="index"
    />
    <slot
      :update="update"
      :list="list"
      :componentKey="componentKey"
      :content="dataContent.items"
    />
  </div>
</template>

<script>
export default {
  name: "ContentBlock",

  props: {
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
    params: {
      required: false,
    },
  },

  data() {
    return {
      indicator: null,
      componentKey: 0,
    };
  },

  async fetch() {
    try {
      // if (this.params.settings.recordLoad) {
      (await this.cardId)
        ? this.$store.dispatch("blocks/fetchWizardBlock", {
            itemId: this.itemId,
            cardId: this.cardId,
          })
        : this.$store.dispatch("blocks/fetchBlock", {
            id: this.itemId,
            query: { ...this.$route.query },
          });
      // }
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
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId).ACTIONSCUR;
      },
    },

    dataContent: {
      get() {
        const block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        }
        return {};
      },
    },

    list() {
      return this.dataContent;
    },

    parentMenu: {
      get() {
        return this.$store.getters["menu/getMenuById"](this.itemId).NPARENTMENU;
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
      this.componentKey += 1;
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

<style scoped></style>
