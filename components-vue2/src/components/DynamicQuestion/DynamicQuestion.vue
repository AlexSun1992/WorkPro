<template>
  <div class="DynamicQuestion">
    <!-- <div class="accordion" role="tablist">
      <dynamic-card
        v-for="(item, idx) in choosenData"
        :key="idx"
        :param="`${idx}`"
        :title="item.SQUESTION"
        :answer="item.SANSWER"
        :parameter="`${idx}`"
      >
      </dynamic-card>
    </div> -->
    <div
      class="accordion"
      role="tablist"
      v-for="(item, idx) in choosenData"
      :key="idx"
    >
      {{ item.name }}
      <div v-for="(elem, idx) in item.data" :key="idx">
        <dynamic-card
          :param="`${(idx = Math.random())}`"
          :title="elem.SQUESTION"
          :answer="elem.SANSWER"
          :parameter="`${idx}`"
        >
        </dynamic-card>
      </div>
    </div>
  </div>
</template>
<script>
import DynamicCard from "./DynamicCards/DynamicCard";
import { VBToggle } from "bootstrap-vue";

export default {
  props: {
    choosenData: {
      type: Array,
      required: true,
      default: () => {},
    },
    isGroup: {
      type: Boolean,
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
};
</script>

<style></style>
