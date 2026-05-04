<template>
  <div v-if="dataContent">
    <slot
      v-for="item in dataContent.items"
      name="data"
      :content="item"
    ></slot>
  </div>
</template>

<script>
export default {
  name: "ContentBlock",
  components: {},
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {};
  },
  async created() {
    try {
      await this.$store.dispatch("blocks/fetchBlock", this.params);
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    params() {
      return { id: this.itemId, zone: this.zone };
    },
    dataContent() {
      if (this.block) {
        return this.block.data;
      }
      return {};
    },
    logged() {
      this.$store.dispatch("blocks/clearBlock");
      return "";
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
