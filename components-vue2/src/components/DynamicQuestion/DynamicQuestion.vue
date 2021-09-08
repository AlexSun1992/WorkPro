<template>
  <div class="DynamicQuestion">
    <div
      class="accordion"
      role="tablist"
      v-for="(item, id) in varLength"
      :key="id"
    >
      {{ item }}
      <dynamic-card
        v-for="(item, idx) in choosenData"
        :key="idx"
        :param="`${idx}`"
        :title="item.SQUESTION"
        :answer="item.SANSWER"
        :parameter="`${idx}`"
      >
      </dynamic-card>
    </div>
  </div>
</template>
<script>
import DynamicCard from "./DynamicCards/DynamicCard";
import { VBToggle } from "bootstrap-vue";

export default {
  props: {
    varLength: {
      type: Array,
      required: true,
      default: () => {},
    },
    productId: {
      type: String,
      required: true,
      default: () => {},
    },
    choosenData: {
      type: Array,
      required: true,
      default: () => {},
    },
  },

  name: "DynamicQuestion",
  components: {
    DynamicCard,
  },
  directives: {
    "b-toggle": VBToggle,
  },
  methods: {},
};
</script>

<style></style>
