<template>
  <div>
    <div v-if="isOpenCard">
      <div
        v-for="(item, id) in dataContent.items"
        :key="id"
        @click.stop="openCard(item)"
      >
        <slot name="data" v-bind:content="item"></slot>
      </div>
    </div>
    <div v-else>
      <filter-block propertyName="SPRODUCTNAME"></filter-block>
      <slot
        v-for="item in dataContent.items"
        name="data"
        v-bind:content="item"
      ></slot>
    </div>
  </div>
</template>

<script>
import Grid from "~/components/Libs/Table/Grid";
import FilterBlock from "./FilterBlock.vue";

export default {
  name: "ContentBlock",
  components: { Grid, FilterBlock },
  props: {
    itemId: {
      required: true,
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
        : this.$store.dispatch("blocks/fetchBlock", { id: this.itemId });
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

    parentMenu: {
      get: function () {
        return this.$store.getters["menu/getMenuById"](this.itemId).NPARENTMENU;
      },
    },
  },
  methods: {
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
