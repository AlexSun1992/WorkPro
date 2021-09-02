<template>
  <div class="DynamicQuestionContainer">
    <DynamicQuestion :product-id="target"></DynamicQuestion>
  </div>
</template>

<script>
import DynamicQuestion from "./DynamicQuestion.vue";
export default {
  props: ["productId"],
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
    };
  },

  created() {
    this.target = this.productId;
  },
};
</script>

<style scoped></style>
