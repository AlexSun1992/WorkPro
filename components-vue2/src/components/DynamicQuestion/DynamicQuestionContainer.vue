<template>
  <div class="DynamicQuestionContainer">
    <DynamicQuestion
      :choosenData="distinctData"
      :product-id="target"
    ></DynamicQuestion>
  </div>
</template>

<script>
import DynamicQuestion from "./DynamicQuestion.vue";
export default {
  props: ["productId", "choosenData"],
  props: {
    productId: {
      type: Number,
      required: true,
      default: () => {},
    },
  },
  components: {
    DynamicQuestion,
  },

  data() {
    return {
      target: "",
      distinctData: [],
    };
  },

  async created() {
    const url = "/free/v2/question";
    let response = await fetch(url);
    let data = await response.json();

    this.distinctData = data.filter((item) => {
      return item.IDRMPRODUCT === this.productId;
    });
  },
};
</script>

<style scoped></style>
