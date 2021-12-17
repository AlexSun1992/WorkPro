<template>
  <b-button @click="transferData">{{ title }}</b-button>
</template>
<script>
export default {
  name: "ChooseButton",
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      required: true,
      default: () => null,
    },

    data: {
      type: Object,
      required: true,
      default: () => {},
    },
  },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](
          this.data.menudic
        );
        if (block) {
          return block.data;
        } else {
          return {};
        }
      },
    },
  },

  methods: {
    transferData() {
      this.$emit("update", this.data);
      this.$store.commit("data_card/setFilters", this.data);
    },
  },
};
</script>
