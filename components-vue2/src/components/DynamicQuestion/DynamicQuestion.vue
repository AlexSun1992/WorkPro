<template>
  <div class="DynamicQuestion">
    <div class="accordion" role="tablist">
      <dynamic-card
        v-for="(item, idx) in testData"
        :key="idx"
        :param="`${idx}`"
        v-b-toggle="`${idx}`"
        :title="item.SQUESTION"
        :answer="item.SANSWER"
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
    productId: {
      type: Number,
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

  data() {
    return {
      testData: [],
    };
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();
    const target = this.productId;

    data.forEach((item) => {
      if (item.IDRMPRODUCT === target) {
        this.testData.push(item);
      }
    });
  },
};
</script>

<style></style>
