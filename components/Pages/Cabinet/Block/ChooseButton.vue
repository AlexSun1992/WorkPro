<template>
  <b-button @click="handOverData">{{ title }}</b-button>
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

    blocks: {
      type: Object,
      required: true,
      default: () => {},
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
          this.blocks.menudic
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
    handOverData() {
      this.$store.commit("data_card/setFilters", this.data);
      this.$emit("update", {
        fieldId: this.blocks.fieldId,
        name: this.blocks.name,
        value: {
          value: this.data,
          text:
            this.data[this.blocks.name.substring(2)] ||
            this.data[this.dataContent.fields[1].label],
        },
      });
    },
  },
};
</script>
