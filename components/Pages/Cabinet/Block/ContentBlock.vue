<template>
  <div>
    <div v-if="isOpenCard">
      <div
        v-for="(item, idx) in dataContent.items"
        :key="idx"
        @click.stop="openCard(item)"
      >
        <slot name="data" v-bind:content="item"></slot>
      </div>
    </div>

    <div v-else>
      <filter-block
        v-on:revealItem="revealElement"
        :group="this.dataName"
      ></filter-block>

      <slot
        v-for="item in this.dataHub"
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
      dataName: [],
      dataHub: [],
    };
  },

  // async fetch() {
  //   try {
  //     (await this.cardId)
  //       ? this.$store.dispatch("blocks/fetchWizardBlock", {
  //           itemId: this.itemId,
  //           cardId: this.cardId,
  //         })
  //       : this.$store.dispatch("blocks/fetchBlock", { id: this.itemId });
  //   } catch (err) {
  //     this.$bvToast.toast(err.response.data.MESSAGE, {
  //       title: "Ошибка",
  //       variant: "danger",
  //       noAutoHide: true,
  //       solid: true,
  //     });
  //   }
  // },

  computed: {
    // dataContent: {
    //   get: function () {
    //     const block = this.$store.getters["blocks/getBlockById"](this.itemId);
    //     if (block) {
    //       return block.data;
    //     } else {
    //       return {};
    //     }
    //   },
    // },
    // parentMenu: {
    //   get: function () {
    //     return this.$store.getters["menu/getMenuById"](this.itemId).NPARENTMENU;
    //   },
    // },
  },
  methods: {
    revealElement(item) {
      console.log(item);
      this.dataHub.forEach((elem) => {
        if (elem.SPRODUCTNAME !== item) {
          // this.dataHub.filter((target))
          this.dataHub.splice(0, 1);
        }
      });
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

  mounted() {
    this.$store.dispatch("blocks/fetchBlock", { id: this.itemId });
    setTimeout(() => {
      const result = this.$store.getters["blocks/getBlockById"](this.itemId);

      for (let i = 0; i < result.data.items.length; i++) {
        this.dataHub.push(result.data.items[i]);
      }

      this.dataHub.forEach((item) => {
        if (!this.dataName.includes(item.SPRODUCTNAME)) {
          this.dataName.unshift(item.SPRODUCTNAME);
        }
      });
    }, 700);
  },
};
</script>

<style scoped></style>
