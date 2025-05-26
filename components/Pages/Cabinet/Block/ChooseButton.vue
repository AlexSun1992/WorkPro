<template>
  <div>
    <button
      type="button"
      class="btn btn-secondary"
      @click="transferData"
    >
      {{ title }}
    </button>
  </div>
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

    name: {
      type: String,
      required: false,
      default: () => "",
    },

    isButtonRender: {
      type: Object,
      required: false,
      default: () => {},
    },
  },

  computed: {
    dataContent: {
      get: function () {
        const block = this.$store.getters["blocks/getUnfilteredBlockById"](this.data.menudic);
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
    },
  },
};
</script>
