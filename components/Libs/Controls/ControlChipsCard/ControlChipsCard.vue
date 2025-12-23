<template>
  <div v-if="data && data.options && data.options.length">
    <span
      v-if="data.label"
      v-html="data.label"
    ></span>
    <div class="chips-card">
      <ChipsCardContent
        v-for="(item, index) of data.options"
        :key="`${getChipsKey(item, index)}`"
        :dataMapping="dataMapping"
        :data="item"
      />
    </div>
  </div>
</template>

<script>
import ChipsCardContent from "./ChipsCardContent";

export default {
  name: "ControlChipsCard",
  components: { ChipsCardContent },
  props: {
    data: {
      type: Object,
      default: () => ({
        options: [],
      }),
    },
    dataMapping: {
      type: Object,
      default: () => ({
        title: "SOBJECT",
        chips: "SINFORMER",
        action: "IDACTION",
        color: "SCOLOR",
      }),
    },
  },
  computed: {
    label() {
      return this.data?.label || "";
    },
    helpText() {
      return this.data?.helpText || "";
    },
    keyField() {
      return this.action || "IDACTION";
    },
  },
  methods: {
    getChipsKey(item, index) {
      return item.ID || item[this.keyField] || index;
    },
  },
};
</script>

<style lang="css" scoped>
.chips-card {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 24px;
}

@media (max-width: 992px) {
  .chips-card {
    width: 100%;
    overflow-x: auto;
    padding: 0 16px 24px 16px;
    margin: 0 -16px -16px -16px;
  }
}
</style>
