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

    dictionaryList: {
      type: Object,
      required: false,
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
          this.dictionaryList.menudic
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
      console.log(this.data);

      this.$store.commit("data_card/setFilters", this.data);

      // this.$emit("update", {
      //   fieldId: this.dictionaryList.fieldId,
      //   name: this.dictionaryList.name,
      //   value: {
      //     value: this.data,
      //     text:
      //       this.data[this.dictionaryList.name.substring(2)] ||
      //       this.data[this.dataContent.fields[1].label],
      //   },
      // });
    },
  },
};
</script>
