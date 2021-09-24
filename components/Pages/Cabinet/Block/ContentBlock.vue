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
    <div v-else-if="indicator === null">
      <filter-block
        @addCount="addSome"
        :group="dataDistinctName"
      ></filter-block>
      <slot
        v-for="item in dataContent.items"
        name="data"
        v-bind:content="item"
      ></slot>
    </div>
    <div v-if="indicator === '!!!'">
      <filter-block
        @addCount="addSome"
        :group="dataDistinctName"
      ></filter-block>
      <slot
        v-for="item in choosenData"
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
      dataDistinctName: [],
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
          block.data.items.forEach((item) => {
            if (!this.dataDistinctName.includes(item.SPRODUCTNAME)) {
              this.dataDistinctName.unshift(item.SPRODUCTNAME);
            }
          });
          return block.data;
        } else {
          return {};
        }
      },
    },

    choosenData: {
      get: function () {
        const data = this.$store.getters["blocks/getChoosenData"];
        if (data) {
          return data;
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
    addSome() {
      this.indicator = "!!!";
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
