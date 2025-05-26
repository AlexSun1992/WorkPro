<template>
  <div v-if="dataContent">
    <slot
      v-for="item in dataContent.items"
      name="data"
      v-bind:content="item"
    ></slot>
  </div>
</template>

<script>
import FilterBlock from "./FilterBlock";

export default {
  name: "ContentBlock",
  components: { FilterBlock },
  props: {
    itemId: {
      required: true,
    },
  },
  data() {
    return {
      params: {
        id: this.itemId,
        zone: this.zone,
      },
    };
  },
  async created() {
    try {
      await this.$store.dispatch("blocks/fetchBlock", this.params);
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    dataContent() {
      if (this.block) {
        return this.block.data;
      }
    },
    async logged() {
      this.params.zone = this.zone;
      this.$store.dispatch("blocks/clearBlock");
      this.$store.getters["auth/getLogged"];
    },
    block() {
      return this.$store.getters["blocks/getBlockById"](this.itemId);
    },
    zone() {
      return this.$store.getters["auth/getLogged"] ? "" : "free";
    },
  },
  watch: {
    async logged() {
      await this.$store.dispatch("blocks/fetchBlock", this.params);
    },
  },
};
</script>

<style scoped></style>
