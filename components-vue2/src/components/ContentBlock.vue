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
const ACCESS_TOKEN = "auth._token.local";
import Cookies from "js-cookie";
export default {
  name: "ContentBlock",
  props: {
    itemId: {
      required: true,
    },
  },
  async created() {
    try {
      let params = {
        id: this.itemId,
        zone: Cookies.get(ACCESS_TOKEN) != "false" ? "" : "free",
      };
      await this.$store.dispatch("blocks/fetchBlock", params);
    } catch (err) {
      console.log(err);
    }
  },
  computed: {
    dataContent() {
      if (this.$store.getters["blocks/getBlockById"](this.itemId)) {
        let block = this.$store.getters["blocks/getBlockById"](this.itemId);
        if (block) {
          return block.data;
        }
      }
    },
  },
};
</script>

<style scoped></style>
