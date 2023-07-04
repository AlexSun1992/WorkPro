<template>
  <div v-if="isOpenCard">
    <div
      v-for="(item, id, index) in dataContent.items"
      :key="id"
      @click.stop="openCard(item)"
    >
      <slot name="data" :update="update" :content="item" :index="index" />
    </div>
  </div>
  <div v-else>
    <slot
      v-for="(item, index) in dataContent.items"
      name="data"
      :content="item"
      :index="index"
    />
    <slot
      :update="update"
      :list="list"
      :filters="filters"
      :getAddField="getAddField"
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
      if (this.cardId) {
        this.$store.dispatch("blocks/fetchWizardBlock", {
          itemId: this.itemId,
          cardId: this.cardId,
          ...this.$route.params,
        });
      } else if (
        this.$store.getters["blocks/getBlockById"](this.itemId) === undefined
      ) {
        this.$store.dispatch("blocks/fetchBlock", {
          id: this.itemId,
          query: { ...this.$route.query },
          ...this.$route.params,
        });
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
    filters() {
      const servers = this.$store.getters["blocks/getServerFilters"];
      return servers;
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
    getAddField(property) {
      const addFields = this.dataContent?.addFields;
      if (addFields) {
        if (addFields[property]) {
          return addFields[property];
        }
        console.warn(
          `В методе getAddField свойство ${property}  не сущесвует или задано неверно. Доступные свойства: ${JSON.stringify(
            addFields
          )}`
        );
      }
      throw new Error("Метод getAddField не может быть выполнен.");
    },
  },
};
</script>

<style scoped></style>
